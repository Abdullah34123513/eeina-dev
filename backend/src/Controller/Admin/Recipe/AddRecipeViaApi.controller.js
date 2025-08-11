import pluralize from "pluralize";
import axios from "axios";
import { SPOONACULAR_API_KEY } from "../../../constant.js";
import { uploadImageFromUrl } from "../../../Handlers/AWSUpload.js";
import Recipe from "../../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../../Utils/asyncHandler.js";
import Ingredient from "../../../models/Ingredient/Ingredient.model.js";
import Categories from "../../../models/categories/Categories.model.js";
import Cuisine from "../../../models/cuisine/cuisine.model.js";
import HealthLabels from "../../../models/healthLabels/healthLabels.model.js";
import DietLabels from "../../../models/dietLabels/dietLabels.model.js";
import { isHaram } from "../../../helper/isHaram.js";
import { translateTexts } from "../../../Services/translator.service.js";

// Helper to extract categories from recipe
const extractCategory = (recipe) => {
      const categories = [];
      const categoryMap = {
            glutenFree: "gluten free",
            dairyFree: "dairy free",
            vegan: "vegan",
            vegetarian: "vegetarian",
      };

      for (const [key, value] of Object.entries(categoryMap)) {
            if (key === "dairyFree") {
                  if (!recipe[key]) {
                        categories.push("dairy");
                  }
            } else if (recipe[key]) {
                  categories.push(value);
            }
      }
      return [...categories, ...recipe.dishTypes];
};

export const RequestForRecipes = asyncHandler(async (req, res, next) => {
      const {
            random,
            cuisines,
            diet,
            type,
            number = 100,
            offset = 0,
            recipe_first_letter,
      } = req.query;
      try {
            // Choose baseUrl based on the "random" flag
            const baseUrl =
                  random === "true"
                        ? "https://api.spoonacular.com/recipes/random"
                        : "https://api.spoonacular.com/recipes/complexSearch";

            const params = new URLSearchParams({
                  apiKey: SPOONACULAR_API_KEY,
                  number,
                  includeNutrition: true,
            });

            if (random !== "true") {
                  params.append("offset", offset);
            }
            if (cuisines) params.append("cuisine", cuisines);
            if (diet) params.append("diet", diet);
            if (type) params.append("type", type);
            if (recipe_first_letter) params.append("query", recipe_first_letter);

            const uri = `${baseUrl}?${params.toString()}`;
            const { data } = await axios.get(uri);

            if (!data) {
                  return next(new apiErrorHandler(404, "No recipes found."));
            }

            return res.status(200).json(new apiResponse(200, data, "Recipes fetched successfully"));
      } catch (error) {
            console.error("Error fetching recipes:", error);
            return next(new apiErrorHandler(500, "Failed to fetch recipes."));
      }
});

export const processRecipeTranslations = async (recipeDoc) => {
      const MAX_RETRIES = 3;
      let retryCount = 0;

      while (retryCount < MAX_RETRIES) {
            try {
                  const translationTasks = [];
                  const translationPaths = [];

                  // Helper to collect translation tasks
                  const addTranslation = (text, path) => {
                        if (text && typeof text === "string") {
                              translationTasks.push(text);
                              translationPaths.push(path);
                        }
                  };

                  // Title translation
                  addTranslation(recipeDoc.title.en, "title.ar");

                  // Description translation
                  addTranslation(recipeDoc.description.en, "description.ar");

                  // Ingredients translation (name and unit)
                  recipeDoc.ingredients.forEach((ingredient, index) => {
                        addTranslation(
                              ingredient.nameClean.en,
                              `ingredients.${index}.nameClean.ar`
                        );
                        addTranslation(ingredient.ingrText.en, `ingredients.${index}.ingrText.ar`);
                        // Add ingredient unit translation if it exists
                        if (ingredient.unit && ingredient.unit.en) {
                              addTranslation(ingredient.unit.en, `ingredients.${index}.unit.ar`);
                        }
                  });

                  // Instructions translation
                  recipeDoc.instructions.forEach((step, index) => {
                        addTranslation(step.step.en, `instructions.${index}.step.ar`);
                  });

                  // Nutrition translation (name and unit)
                  recipeDoc.nutrition?.nutrients?.forEach((nutrient, index) => {
                        addTranslation(nutrient.name.en, `nutrition.nutrients.${index}.name.ar`);
                        // Add nutrient unit translation if it exists
                        if (nutrient.unit && nutrient.unit.en) {
                              addTranslation(
                                    nutrient.unit.en,
                                    `nutrition.nutrients.${index}.unit.ar`
                              );
                        }
                  });

                  // Category, Cuisine, HealthLabels, DietLabels translation
                  const processArray = (array, field) => {
                        array?.forEach((item, index) => {
                              addTranslation(item.en, `${field}.${index}.ar`);
                        });
                  };

                  processArray(recipeDoc.category, "category");
                  processArray(recipeDoc.cuisine, "cuisine");
                  processArray(recipeDoc.healthLabels, "healthLabels");
                  processArray(recipeDoc.dietLabels, "dietLabels");

                  if (translationTasks.length === 0) return;

                  // Batch translate all texts
                  const translatedTexts = await translateTexts(translationTasks, "ar");

                  // Apply translations to document
                  translatedTexts.forEach((translatedText, index) => {
                        recipeDoc.set(translationPaths[index], translatedText);
                  });

                  return;
            } catch (error) {
                  if (error.message.includes("TooManyRequestsError") && retryCount < MAX_RETRIES) {
                        retryCount++;
                        await new Promise((resolve) => setTimeout(resolve, 5000 * retryCount));
                        continue;
                  }
                  console.error("Translation error:", error);
                  break;
            }
      }
};

export const SaveRecipeInDB = asyncHandler(async (req, res, next) => {
      const { recipeData, recipeApiType } = req.body;
      if (!recipeData) {
            return next(new apiErrorHandler(400, "No recipe data provided."));
      }


      try {
            let recipesToSave = [];
            if (recipeApiType === "ids") {
                  const idsArray = recipeData.map((id) => id.toString().trim());
                  const apiUrl = `https://api.spoonacular.com/recipes/informationBulk?ids=${idsArray.join(
                        ","
                  )}&apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
                  const response = await axios.get(apiUrl);
                  if (response?.data) recipesToSave = response.data;
            } else {
                  recipesToSave = recipeData;
            }

            if (!recipesToSave.length) {
                  return next(new apiErrorHandler(400, "No valid recipes to save."));
            }

            let successCount = 0,
                  failedCount = 0,
                  skippedCount = 0;
            let totalCategory = new Set();
            let totalCuisine = new Set();
            let totalHealthLabels = new Set();
            let totalDietLabels = new Set();
            let ingredientsSet = new Set();

            for (const recipe of recipesToSave) {
                  try {
                        const existingRecipe = await Recipe.findOne({
                              "metadata.originalUrl": recipe.sourceUrl,
                        });
                        if (existingRecipe) {
                              skippedCount++;
                              continue;
                        }

                        const ingrNames = recipe.extendedIngredients.map((ing) => ing.name);
                        console.log("Ingredient Names:", ingrNames);
                        if (isHaram(ingrNames)) {
                              skippedCount++;
                              continue;
                        }

                        // Process image
                        const recipeImage = { url: recipe.image || "", key: "" };
                        if (recipe.image) {
                              try {
                                    const resImg = await uploadImageFromUrl(
                                          recipe.image,
                                          recipe.title
                                    );
                                    recipeImage.url = resImg.Location;
                                    recipeImage.key = resImg.Key;
                              } catch (imageError) {
                                    console.error("Image upload failed:", imageError);
                              }
                        }

                        // Process ingredients
                        const ingredients = [];

                        const processedIngredients = recipe.extendedIngredients.map(async (ing) => {
                              const name = pluralize.singular(ing.name);
                              const unit = ing.unit || "";

                              const doc = await Ingredient.findOneAndUpdate(
                                    { "name.en": name },
                                    { $setOnInsert: { name: { en: name, ar: "" } } },
                                    { upsert: true, new: true }
                              );
                              ingredientsSet.add(name);

                              return {
                                    ingrText: { en: ing.originalName, ar: "" },
                                    nameClean: { en: name, ar: "" },
                                    details: doc._id,
                                    amount: ing.amount,
                                    unit: { en: unit, ar: "" },
                              };
                        });
                        const processedIngredientsArray = await Promise.all(processedIngredients);
                        ingredients.push(...processedIngredientsArray);

                        // Process categories and labels
                        const category =
                              recipe.dishTypes?.map((dish) =>
                                    dish.replace(/\b\w/g, (char) => char.toUpperCase())
                              ) || [];

                        const healthLabelsSet = new Set([
                              ...Object.entries({
                                    vegetarian: "Vegetarian",
                                    vegan: "Vegan",
                                    glutenFree: "Gluten Free",
                                    dairyFree: "Dairy Free",
                                    veryHealthy: "Healthy",
                              })
                                    .filter(([key]) => recipe[key])
                                    .map(([, value]) => value),
                              ...(recipe.diets?.map((diet) =>
                                    diet.replace(/\b\w/g, (char) => char.toUpperCase())
                              ) || []),
                        ]);

                        const dietLabels = calculateDietLabels(recipe);

                        // Create recipe document with empty translations
                        const newRecipe = new Recipe({
                              title: {
                                    en: recipe.title,
                                    ar: "",
                              },
                              description: {
                                    en: recipe.summary.replace(/<[^>]*>/g, "") || "",
                                    ar: "",
                              },
                              ingredients,
                              nutrition: {
                                    nutrients:
                                          recipe.nutrition?.nutrients?.map((nutrient) => ({
                                                name: {
                                                      en: nutrient.name,
                                                      ar: "",
                                                },
                                                amount: nutrient.amount,
                                                // Ensure unit is stored as an object with both keys
                                                unit: { en: nutrient.unit || "", ar: "" },
                                                percentOfDailyNeeds: nutrient.percentOfDailyNeeds,
                                          })) || [],
                              },
                              instructions:
                                    recipe.analyzedInstructions?.[0]?.steps?.map((step) => ({
                                          step: {
                                                en: step.step,
                                                ar: "",
                                          },
                                          image: {
                                                url: step.image || "",
                                                key: step.key || "",
                                          },
                                    })) || [],
                              servings: recipe.servings || 1,
                              time: recipe.readyInMinutes,
                              source: recipe.sourceUrl || "",
                              category: category.map((cat) => ({ en: cat, ar: "" })),
                              healthLabels: Array.from(healthLabelsSet).map((label) => ({
                                    en: label,
                                    ar: "",
                              })),
                              dietLabels: dietLabels.map((label) => ({ en: label, ar: "" })),
                              cuisine: (recipe.cuisines || []).map((c) => ({ en: c, ar: "" })),
                              thumbnail: recipeImage,
                              metadata: {
                                    imported: true,
                                    site: recipe.sourceName.replace(/\.com$/, ""),
                                    originalUrl: recipe.sourceUrl || "",
                                    importDate: new Date(),
                              },
                        });

                        // Process translations inside the recipe document
                        await processRecipeTranslations(newRecipe);
                        await newRecipe.save();
                        successCount++;

                        // Update aggregates for bulk reference updates
                        category.forEach((cat) => totalCategory.add(cat));
                        (recipe.cuisines || []).forEach((cui) => totalCuisine.add(cui));
                        healthLabelsSet.forEach((hl) => totalHealthLabels.add(hl));
                        dietLabels.forEach((dl) => totalDietLabels.add(dl));
                  } catch (err) {
                        console.error(`Failed to save recipe (ID: ${recipe.id}):`, err);
                        failedCount++;
                  }
            }

            // Helper to translate an array of texts and update the corresponding reference collection.
            const processReference = async (Model, itemsArray) => {
                  if (!itemsArray.length) return;
                  const translatedTexts = await translateTexts(itemsArray, "ar");
                  const promises = itemsArray.map((text, index) =>
                        Model.findOneAndUpdate(
                              { "name.en": text },
                              { name: { en: text, ar: translatedTexts[index] } },
                              { upsert: true, new: true }
                        )
                  );
                  return Promise.all(promises);
            };

            // Bulk update references with translations
            await Promise.all([
                  processReference(Categories, Array.from(totalCategory)),
                  processReference(Cuisine, Array.from(totalCuisine)),
                  processReference(HealthLabels, Array.from(totalHealthLabels)),
                  processReference(DietLabels, Array.from(totalDietLabels)),
                  processReference(Ingredient, Array.from(ingredientsSet)),
            ]);

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              { successCount, skippedCount, failedCount },
                              "Recipe saving completed."
                        )
                  );
      } catch (error) {
            console.error("Error processing recipes:", error);
            return next(new apiErrorHandler(500, "Failed to process recipes."));
      }
});

function calculateDietLabels(recipe) {
      const nutrients = recipe.nutrition?.nutrients || [];

      // Helper: find a nutrient by matching its name (case insensitive)
      const findNutrient = (names) =>
            nutrients.find((n) =>
                  names.some((name) => n.name.toLowerCase() === name.toLowerCase())
            );

      // Get key nutrient objects
      const caloriesObj = findNutrient(["Calories", "Energy"]);
      const proteinObj = findNutrient(["Protein"]);
      const fatObj = findNutrient(["Fat"]);
      const carbObj = findNutrient(["Carbohydrates", "Carbs"]);
      const fiberObj = findNutrient(["Fiber"]);
      const sodiumObj = findNutrient(["Sodium", "Na"]);

      // Total calories from the recipe (if not available, default to 0)
      const totalCalories = caloriesObj ? caloriesObj.amount : 0;

      // Calculate calories from macronutrients (assumes amounts in grams)
      const proteinCalories = proteinObj ? proteinObj.amount * 4 : 0;
      const carbCalories = carbObj ? carbObj.amount * 4 : 0;
      const fatCalories = fatObj ? fatObj.amount * 9 : 0;

      const labels = [];

      // Balanced: Check if macros are in approximately 15/35/50 ratio.
      // Use a tolerance of ±5%
      if (totalCalories) {
            const proteinPct = (proteinCalories / totalCalories) * 100;
            const fatPct = (fatCalories / totalCalories) * 100;
            const carbPct = (carbCalories / totalCalories) * 100;
            const tolerance = 5;

            if (
                  Math.abs(proteinPct - 15) <= tolerance &&
                  Math.abs(fatPct - 35) <= tolerance &&
                  Math.abs(carbPct - 50) <= tolerance
            ) {
                  labels.push("Balanced");
            }
      }

      // High-Fiber: More than 5g fiber per serving
      if (fiberObj?.amount > 5) {
            labels.push("High Fiber");
      }

      // High-Protein: More than 50% of total calories from proteins
      if (totalCalories && (proteinCalories / totalCalories) * 100 > 50) {
            labels.push("High Protein");
      }

      // Low-Carb: Less than 20% of total calories from carbs
      if (totalCalories && (carbCalories / totalCalories) * 100 < 20) {
            labels.push("Low Carb");
      }

      // Low-Fat: Less than 15% of total calories from fat
      if (totalCalories && (fatCalories / totalCalories) * 100 < 15) {
            labels.push("Low Fat");
      }

      // Low-Sodium: Less than 140mg Na per serving
      if (sodiumObj && sodiumObj.amount < 140) {
            labels.push("Low Sodium");
      }

      return labels;
}
