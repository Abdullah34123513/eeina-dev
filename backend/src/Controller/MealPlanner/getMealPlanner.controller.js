import MealPlan from "../../models/mealPlanner/mealPlanner.model.js";
import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getMealPlanner = asyncHandler(async (req, res) => {
      try {
            const userId = req.user._id;
            const { date } = req.params;

            if (!date) {
                  throw new apiErrorHandler("Date is required");
            }

            const planDate = new Date(date);
            const mealPlan = await MealPlan.findOne({ user: userId, date: planDate });

            // if (!mealPlan) {
            //       throw new apiErrorHandler("Meal plan not found", 404);
            // }

            // Fetch full recipe details for stored recipe IDs
            const populateMealPlan = async (mealPlanData) => {
                  const populatedData = {};
                  for (const mealType in mealPlanData) {
                        if (Array.isArray(mealPlanData[mealType])) {
                              // Fetch all valid recipe IDs
                              const recipeIds = mealPlanData[mealType].filter(id => id !== null);
                              const recipes = await Recipe.find({ _id: { $in: recipeIds } });

                              // Convert array of IDs to full recipe objects, keeping `null` placeholders
                              const recipeMap = recipes.reduce((acc, recipe) => {
                                    acc[recipe._id] = recipe;
                                    return acc;
                              }, {});

                              populatedData[mealType] = mealPlanData[mealType].map(id => id ? recipeMap[id] || null : null);
                        } else {
                              populatedData[mealType] = mealPlanData[mealType];
                        }
                  }
                  return populatedData;
            };

            const fullMealPlan = await populateMealPlan(mealPlan?.mealPlan);

            return res.status(200).json(
                  new apiResponse(200, { ...mealPlan?.toObject(), mealPlan: fullMealPlan }, "Meal plan fetched successfully")
            );

      } catch (error) {
            console.error("Error fetching meal plan:", error);
            throw new apiErrorHandler("Error fetching meal plan");
      }
});

export default getMealPlanner;
