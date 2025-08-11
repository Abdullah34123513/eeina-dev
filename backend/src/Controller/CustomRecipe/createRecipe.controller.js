import { deleteMedia, moveS3Objects, uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";
import { EdamamNutritionService } from "../../Services/nutrition/edamamNutrition.service.js";
import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

import Categories from "../../models/categories/Categories.model.js";
import Cuisine from "../../models/cuisine/cuisine.model.js";
import HealthLabels from "../../models/healthLabels/healthLabels.model.js";
import DietLabels from "../../models/dietLabels/dietLabels.model.js";
import { isHaram } from "../../helper/isHaram.js";

import { translateTexts } from "../../Services/translator.service.js";
import detectLanguage from "../../Services/detectLanguage.service.js";

// 1) Given an array of strings, produce [{en,ar}, …] by auto‑detecting each
async function batchTranslateToBothLangs(items) {
      if (!items?.length) return [];
      const langs = await Promise.all(items.map(detectLanguage));

      // split into EN vs AR batches
      const toEnKeys = [],
            toArKeys = [];
      const enTexts = [],
            arTexts = [];
      for (let i = 0; i < items.length; i++) {
            if (langs[i] === "ar") {
                  // needs English
                  arTexts.push(items[i]);
                  toEnKeys.push(i);
                  enTexts.push(null);
            } else {
                  // needs Arabic
                  enTexts.push(items[i]);
                  toArKeys.push(i);
                  arTexts.push(null);
            }
      }

      const translatedToEn = toEnKeys.length
            ? await translateTexts(arTexts.filter(Boolean), "en-US")
            : [];
      const translatedToAr = toArKeys.length
            ? await translateTexts(enTexts.filter(Boolean), "ar")
            : [];

      // merge results back
      let e = 0,
            a = 0;
      return items.map((_, i) => ({
            en: enTexts[i] ?? translatedToEn[e++],
            ar: arTexts[i] ?? translatedToAr[a++],
      }));
}

// 2) Turn an array of raw strings into [{en,ar},…]
const processStringArrayToLangObj = (arr) => (arr?.length ? batchTranslateToBothLangs(arr) : []);

// 3) Upload images in parallel
const uploadImagesInParallel = (files) =>
      Promise.all(files.map((f) => uploadMediaUserDevice(f.path, f.filename)));

// 4) Upsert reference collections in parallel
async function processReferenceCollection(Model, items) {
      if (!items?.length) return;
      const batch = await batchTranslateToBothLangs(items);
      await Promise.all(
            batch.map((obj) =>
                  Model.findOneAndUpdate(
                        { "name.en": obj.en },
                        { name: obj },
                        { upsert: true, new: true }
                  )
            )
      );
}

export default asyncHandler(async (req, res, next) => {


      // parse + validate
      let { title, description, ingredients, instructions, time, servings, videoUrl, thumbnail, otherImages, toDeleteImages } = req.body;
      if (!title || !description || !ingredients || !instructions || !time || !servings || !thumbnail) {
            return next(new apiErrorHandler(400, "Please provide all required fields"));
      }
      if (typeof thumbnail === "string") thumbnail = JSON.parse(thumbnail);
      if (typeof ingredients === "string") ingredients = JSON.parse(ingredients);
      if (typeof instructions === "string") instructions = JSON.parse(instructions);
      if (typeof otherImages === "string") otherImages = JSON.parse(otherImages);
      if (typeof toDeleteImages === "string") toDeleteImages = JSON.parse(toDeleteImages);

      const otherImagesToMove = otherImages.map(img => img?.key)
      const thumbnailToMove = thumbnail?.key;
      const instructionImagesToMove = instructions.map(ins => ins?.image?.key);

      const [
            movedOtherImages,
            movedThumbnail,
            movedInstructionImages
      ] = await Promise.all([
            moveS3Objects(otherImagesToMove),
            thumbnailToMove ? moveS3Objects([thumbnailToMove]) : Promise.resolve([]),
            moveS3Objects(instructionImagesToMove),
      ]);
      console.log("movedOtherImages:", movedOtherImages);
      console.log("movedThumbnail:", movedThumbnail);
      console.log("movedInstructionImages:", movedInstructionImages);

      console.log("thumbnail:", thumbnail);

      const allTexts = [title, description, ...ingredients, ...instructions.map((ins) => ins.step)];

      const inputLang = detectLanguage(allTexts.join(" "));

      if (inputLang === "unknown") {
            return next(new apiErrorHandler(400, "Mixed languages detected, please use only one language"));
      }

      // prepare Edamam payload in EN
      let titleForEd = title,
            descForEd = description;
      if (inputLang === "ar") {
            [titleForEd, descForEd] = await Promise.all([
                  translateTexts([title], "en-US").then((r) => r[0]),
                  translateTexts([description], "en-US").then((r) => r[0]),
            ]);
            ingredients = await translateTexts(ingredients, "en-US");
      }


      // const [thumbUp, ...othersUp] = await uploadImagesInParallel([thumbnail[0], ...otherImages]);

      // translate steps & upload inst images
      const stepsObjs = await batchTranslateToBothLangs(instructions.map((i) => i.step));
      const finalInstructions = instructions.map((i, idx) => ({
            step: stepsObjs[idx],
            image: movedInstructionImages[idx]
      }));

      const nutritionSvc = new EdamamNutritionService();
      const ed = await nutritionSvc.getNurition(ingredients, titleForEd, servings);

      if (!ed) {
            return next(
                  new apiErrorHandler(
                        400,
                        "Ingredients are not properly formatted, please input ingredients in proper format."
                  )
            );
      }

      const { nutrients, ingredients: parsed, category, cuisine, dietLabels, healthLabels } = ed;
      if (isHaram(parsed.map((i) => i.nameClean))) {
            return next(new apiErrorHandler(400, "This recipe contains haram ingredients."));
      }

      // translate & upsert parsed ingredients
      const names = parsed.map((i) => i.nameClean);
      const units = parsed.map((i) => i.unit || "");
      const ingrTexts = parsed.map((i) => i.ingrText || "");
      const nameObjs = await batchTranslateToBothLangs(names);
      const unitObjs = await batchTranslateToBothLangs(units);
      const ingrTextObjs = await batchTranslateToBothLangs(ingrTexts);

      const formattedIngredients = await Promise.all(
            parsed.map(async (ing, idx) => {
                  const doc = await Ingredient.findOneAndUpdate(
                        { "name.en": names[idx] },
                        { name: nameObjs[idx] },
                        { upsert: true, new: true }
                  );
                  return {
                        ingrText: ingrTextObjs[idx],
                        nameClean: nameObjs[idx],
                        amount: ing.amount,
                        unit: unitObjs[idx],
                        details: doc._id,
                  };
            })
      );

      // translate nutrients
      const nutrNames = nutrients.map((n) => n.name);
      const nutrUnits = nutrients.map((n) => n.unit);
      const nutrNameObjs = await batchTranslateToBothLangs(nutrNames);
      const nutrUnitObjs = await batchTranslateToBothLangs(nutrUnits);

      const translatedNutrients = nutrients.map((n, i) => ({
            name: nutrNameObjs[i],
            amount: n.amount,
            unit: nutrUnitObjs[i],
            percentOfDailyNeeds: n.percentOfDailyNeeds,
      }));

      // translate original title/description to both langs
      const [recipeTitle, recipeDesc] = await batchTranslateToBothLangs([title, description]);

      // translate refs
      const [catObjs, cuiObjs, dietObjs, healthObjs] = await Promise.all([
            processStringArrayToLangObj(category),
            processStringArrayToLangObj(cuisine),
            processStringArrayToLangObj(dietLabels),
            processStringArrayToLangObj(healthLabels),
      ]);

      // save recipe
      const recipeDoc = new Recipe({
            title: recipeTitle,
            description: recipeDesc,
            ingredients: formattedIngredients,
            instructions: finalInstructions,
            time,
            servings,
            nutrition: { nutrients: translatedNutrients },
            videoUrl,
            thumbnail: movedThumbnail[0],
            otherImages: movedOtherImages,
            category: catObjs,
            cuisine: cuiObjs,
            dietLabels: dietObjs,
            healthLabels: healthObjs,
            createdBy: req.user._id,
      });
      await recipeDoc.save();

      // upsert reference collections
      await Promise.all([
            processReferenceCollection(Categories, category),
            processReferenceCollection(Cuisine, cuisine),
            processReferenceCollection(DietLabels, dietLabels),
            processReferenceCollection(HealthLabels, healthLabels),
      ]);
      if (toDeleteImages?.length) {
            Promise.all(toDeleteImages.map((img) => deleteMedia(img)));
      }

      return res.json(new apiResponse(201, recipeDoc, "Recipe created successfully"));
});
