// src/Controller/CustomRecipe/importRecipe.controller.js

import axios from "axios";
import { uploadImageFromUrl } from "../../Handlers/AWSUpload.js";
import Recipe from "../../models/recipe/recipe.model.js";
import Ingredient from "../../models/Ingredient/Ingredient.model.js";

import Categories from "../../models/categories/Categories.model.js";
import Cuisine from "../../models/cuisine/cuisine.model.js";
import DietLabels from "../../models/dietLabels/dietLabels.model.js";
import HealthLabels from "../../models/healthLabels/healthLabels.model.js";

import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { RECIPE_SCRAPER_URL, EDAMAM_APP_ID, EDAMAM_APP_KEY } from "../../constant.js";
import { isHaram } from "../../helper/isHaram.js";

import detectLanguage from "../../Services/detectLanguage.service.js";
import { translateTexts } from "../../Services/translator.service.js";
import { EdamamNutritionService } from "../../Services/nutrition/edamamNutrition.service.js";

/**
 * Batch‐translate an array of strings into objects { en, ar }.
 * Auto‐detects each item’s language, sends only the necessary ones
 * to DeepL, then merges back.
 */
async function batchTranslateToBothLangs(items) {
      if (!items?.length) return [];
      // detect each
      const langs = await Promise.all(items.map(detectLanguage));
      // collect subarrays
      const toEn = [],
            toAr = [];
      const enSlots = [],
            arSlots = [];
      langs.forEach((lang, i) => {
            if (lang === "ar") {
                  toEn.push(items[i]);
                  arSlots.push(i);
            } else {
                  toAr.push(items[i]);
                  enSlots.push(i);
            }
      });
      // translate
      const [resEn = [], resAr = []] = await Promise.all([
            toEn.length ? translateTexts(toEn, "en") : Promise.resolve([]),
            toAr.length ? translateTexts(toAr, "ar") : Promise.resolve([]),
      ]);
      // merge back
      const out = Array(items.length);
      let enIdx = 0,
            arIdx = 0;
      items.forEach((_, i) => {
            if (arSlots.includes(i)) {
                  out[i] = { en: resEn[arIdx], ar: items[i] };
                  arIdx++;
            } else {
                  out[i] = { en: items[i], ar: resAr[enIdx] };
                  enIdx++;
            }
      });
      return out;
}

/** Turn a simple array of English strings into [{en,ar},…] */
const processStringArrayToLangObj = (arr) => (arr?.length ? batchTranslateToBothLangs(arr) : []);

/** Upsert a reference model with bilingual { name: {en,ar} } */
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

/** Upload N local files in parallel (AWS S3) */
const uploadImagesInParallel = (files) =>
      Promise.all(files.map((f) => uploadImageFromUrl(f.path || f, f.filename || f)));

export default asyncHandler(async (req, res, next) => {
      const { recipeUrl } = req.body;
      const userId = req.user._id;

      if (!recipeUrl) {
            return next(new apiErrorHandler(400, "recipeUrl is required"));
      }

      // 1) Scrape via your scraper service
      let scraped;

      try {
            const { data } = await axios.get(
                  `${RECIPE_SCRAPER_URL}/scrape?url=${encodeURIComponent(recipeUrl)}`
            );
            scraped = data.data;
      } catch (err) {
            return next(
                  new apiErrorHandler(
                        400,
                        "This URL is not valid or this site is not supported. Please try another one."
                  )
            );
      }

      const {
            title,
            description,
            instructions_list: instructionsList = [],
            yields,
            image,
            ingredients: rawIngredients = [],
            total_time,
      } = scraped;

      // servings
      const servings = yields?.match(/\d+/)?.[0] || null;

      // 2) Detect whether scraped text is Arabic or English
      const inputLang = await detectLanguage(title);
      // prepare Edamam inputs in English
      let titleForEd = title;
      let descForEd = description;
      let ingrForEd = rawIngredients.slice();

      if (inputLang === "ar") {
            // translate title & description
            [titleForEd, descForEd] = await Promise.all([
                  translateTexts([title], "en").then((r) => r[0]),
                  translateTexts([description], "en").then((r) => r[0]),
            ]);
            // translate all scraped ingredients
            ingrForEd = await translateTexts(rawIngredients, "en");
      }

      // 3) Upload thumbnail + no “otherImages” from scraper
      let thumbObj = null;
      if (image) {
            try {
                  const up = await uploadImageFromUrl(image, title);
                  thumbObj = { url: up.Location, key: up.key };
            } catch (err) {
                  return next(new apiErrorHandler(500, "This recipe cann't be imported. Bad image."));
            }
      }

      // 4) Call Edamam (returns English‐only data)
      const nutritionSvc = new EdamamNutritionService();
      const ed = await nutritionSvc.getNurition(ingrForEd, titleForEd, servings);

      if (!ed) {
            return next(
                  new apiErrorHandler(
                        400,
                        "This recipe cann't be imported. Poor ingredient formatting"
                  )
            );
      }

      const {
            nutrients,
            ingredients: parsedIngr,
            category,
            cuisine,
            dietLabels,
            healthLabels,
      } = ed;

      // 5) Haram check
      if (isHaram(parsedIngr.map((i) => i.nameClean))) {
            return next(new apiErrorHandler(400, "This recipe contains haram ingredients."));
      }

      // 6) Process & translate parsed ingredients
      const ingNames = parsedIngr.map((i) => i.nameClean);
      const ingUnits = parsedIngr.map((i) => i.unit || "");
      const ingNameObjs = await batchTranslateToBothLangs(ingNames);
      const unitObjs = await batchTranslateToBothLangs(ingUnits);

      const formattedIngredients = await Promise.all(
            parsedIngr.map(async (ing, idx) => {
                  const doc = await Ingredient.findOneAndUpdate(
                        { "name.en": ingNames[idx] },
                        { name: ingNameObjs[idx] },
                        { upsert: true, new: true }
                  );
                  return {
                        ingrText: ing.ingrText,
                        nameClean: ingNameObjs[idx],
                        amount: ing.amount,
                        unit: unitObjs[idx],
                        details: doc._id,
                  };
            })
      );

      // 7) Translate nutrients
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

      // 8) Translate title / description to both langs
      const [recipeTitleObj, recipeDescObj] = await batchTranslateToBothLangs([title, description]);

      // 9) Translate instructions_list to bilingual steps
      const instrObjs = await batchTranslateToBothLangs(instructionsList);
      const instructions = instrObjs.map((obj) => ({ step: obj, image: { url: "", key: "" } }));

      // 10) Translate reference arrays
      const [catObjs, cuiObjs, dietObjs, healthObjs] = await Promise.all([
            processStringArrayToLangObj(category),
            processStringArrayToLangObj(cuisine),
            processStringArrayToLangObj(dietLabels),
            processStringArrayToLangObj(healthLabels),
      ]);

      // 11) Build & save Recipe
      const recipeDoc = await Recipe.create({
            title: recipeTitleObj,
            description: recipeDescObj,
            instructions,
            servings,
            healthLabels: healthObjs,
            dietLabels: dietObjs,
            nutrition: { nutrients: translatedNutrients },
            ingredients: formattedIngredients,
            category: catObjs,
            cuisine: cuiObjs,
            time: total_time,
            thumbnail: thumbObj,
            createdBy: userId,
      });

      // 12) Upsert your reference collections
      await Promise.all([
            processReferenceCollection(Categories, category),
            processReferenceCollection(Cuisine, cuisine),
            processReferenceCollection(DietLabels, dietLabels),
            processReferenceCollection(HealthLabels, healthLabels),
      ]);

      return res.status(201).json(new apiResponse(201, recipeDoc, "Recipe imported successfully."));
});
