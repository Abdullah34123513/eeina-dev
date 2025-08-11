import { deleteMedia, uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";
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

import detectLanguage from "../../Services/detectLanguage.service.js";
import { translateTexts } from "../../Services/translator.service.js";
import { EdamamNutritionService } from "../../Services/nutrition/edamamNutrition.service.js";

// Helper
const upsertReference = async (Model, items) => {
      if (!items?.length) return;
      await Promise.all(
            items.map(async (en) => {
                  const [ar] = await translateTexts([en], "ar");
                  await Model.findOneAndUpdate(
                        { "name.en": en },
                        { name: { en, ar } },
                        { upsert: true, new: true }
                  );
            })
      );
};

export const editRecipeController = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      let { title, description, ingredients, instructions, time, servings, videoUrl, thumbnail, otherImages, toDeleteImages } = req.body;

      const recipe = await Recipe.findById(id);
      console.log("ingredients", ingredients);
      if (!recipe) return next(new apiErrorHandler(404, "Recipe not found"));

      try {
            if (typeof ingredients === "string") ingredients = JSON.parse(ingredients);
            if (typeof instructions === "string") instructions = JSON.parse(instructions);
            if (typeof thumbnail === "string") thumbnail = JSON.parse(thumbnail);
            if (typeof otherImages === "string") otherImages = JSON.parse(otherImages);
            if (typeof toDeleteImages === "string") toDeleteImages = JSON.parse(toDeleteImages);
      } catch {
            return next(new apiErrorHandler(400, "Invalid JSON in ingredients or instructions"));
      }
      console.log("ingredients", ingredients);
      if (
            !title ||
            !description ||
            !Array.isArray(ingredients) ||
            !Array.isArray(instructions) ||
            !time ||
            !servings
      ) {
            return next(new apiErrorHandler(400, "Missing required fields"));
      }

      const allTexts = [title, description, ...ingredients, ...instructions.map((ins) => ins.step)];

      const inputLang = detectLanguage(allTexts.join(" "));

      if (inputLang === "unknown") {
            return next(
                  new apiErrorHandler(400, "Mixed languages detected, please use only one language")
            );
      }
      const isArabic = inputLang === "ar";

      let titleForEd = title,
            descForEd = description;

      if (isArabic) {
            const [trTitle, trDesc, ...trIngr] = await translateTexts(
                  [title, description, ...ingredients],
                  "en-US"
            );
            [titleForEd, descForEd] = [trTitle, trDesc];
            ingredients = trIngr;
      }



      const instructionSteps = instructions.map((i) => i.step);
      const translatedSteps = await translateTexts(instructionSteps, "ar");
      const updatedInstructions = instructions.map((step, i) => ({
            step: { en: step.step, ar: translatedSteps[i] },
            image: step.image
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

      if (isHaram(ed.ingredients.map((i) => i.nameClean))) {
            return next(new apiErrorHandler(400, "Haram ingredients are not allowed"));
      }

      const names = [];
      const units = [];
      const ingrTexts = [];

      for (const i of ed.ingredients) {
            names.push(i.nameClean);
            units.push(i.unit || "");
            ingrTexts.push(i.ingrText || "");
      }

      const [trNames, trUnits, trIngrTexts] = await Promise.all([
            translateTexts(names, "ar"),
            translateTexts(units, "ar"),
            translateTexts(ingrTexts, "ar"),
      ]);

      const formattedIngredients = await Promise.all(
            ed.ingredients.map(async (ing, i) => {
                  const doc = await Ingredient.findOneAndUpdate(
                        { "name.en": ing.nameClean },
                        { name: { en: ing.nameClean, ar: trNames[i] } },
                        { upsert: true, new: true }
                  );
                  return {
                        ingrText: { en: ing.ingrText, ar: trIngrTexts[i] },
                        nameClean: { en: ing.nameClean, ar: trNames[i] },
                        amount: ing.amount,
                        unit: { en: ing.unit, ar: trUnits[i] },
                        details: doc._id,
                  };
            })
      );

      const nutrients = await Promise.all(
            ed.nutrients.map(async (n) => {
                  const [trName, trUnit] = await translateTexts([n.name, n.unit], "ar");
                  return {
                        name: { en: n.name, ar: trName },
                        amount: n.amount,
                        unit: { en: n.unit, ar: trUnit },
                        percentOfDailyNeeds: n.percentOfDailyNeeds,
                  };
            })
      );

      const [trTitle, trDesc] =
            inputLang === "en"
                  ? await translateTexts([title, description], "ar")
                  : await translateTexts([title, description], "en-US");

      const recipeTitle =
            inputLang === "en" ? { en: title, ar: trTitle } : { en: trTitle, ar: title };
      const recipeDescription =
            inputLang === "en" ? { en: description, ar: trDesc } : { en: trDesc, ar: description };

      const [catLang, cuiLang, healthLang, dietLang] = await Promise.all([
            translateTexts(ed.category, "ar"),
            translateTexts(ed.cuisine, "ar"),
            translateTexts(ed.healthLabels, "ar"),
            translateTexts(ed.dietLabels, "ar"),
      ]);

      const category = ed.category.map((v, i) => ({ en: v, ar: catLang[i] }));
      const cuisine = ed.cuisine.map((v, i) => ({ en: v, ar: cuiLang[i] }));
      const healthLabels = ed.healthLabels.map((v, i) => ({ en: v, ar: healthLang[i] }));
      const dietLabels = ed.dietLabels.map((v, i) => ({ en: v, ar: dietLang[i] }));

      await Promise.all([
            upsertReference(Categories, ed.category),
            upsertReference(Cuisine, ed.cuisine),
            upsertReference(HealthLabels, ed.healthLabels),
            upsertReference(DietLabels, ed.dietLabels),
      ]);

      if (isArabic) {
            const translatedSteps = await translateTexts(instructionSteps, "en-US");
            updatedInstructions.forEach((step, i) => {
                  step.step.en = translatedSteps[i];
            });
      }

      const updatedData = {
            title: recipeTitle,
            description: recipeDescription,
            ingredients: formattedIngredients,
            instructions: updatedInstructions,
            time,
            servings,
            videoUrl,
            thumbnail: thumbnail,
            otherImages: otherImages,
            nutrition: { nutrients },
            category,
            cuisine,
            healthLabels,
            dietLabels,
      };

      const canOverwrite =
            recipe.createdBy?.toString() === req.user._id.toString() ||
            (recipe.metadata?.imported && ["admin", "super-admin"].includes(req.user.role));

      if (toDeleteImages?.length > 0) {
            console.log("Deleting images:", toDeleteImages);
            Promise.all(toDeleteImages?.map((img) => deleteMedia(img)));
      }

      if (canOverwrite) {
            Object.assign(recipe, updatedData);
            await recipe.save();
            return res
                  .status(200)
                  .json(new apiResponse(200, recipe, "Recipe updated successfully"));
      } else {
            const newDoc = await Recipe.create({ ...updatedData, createdBy: req.user._id });
            return res.status(201).json(new apiResponse(201, newDoc, "Recipe created"));
      }
});