import MealPlan from "../../models/mealPlanner/mealPlanner.model.js";
import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getMealNutritions = asyncHandler(async (req, res, next) => {
      const userId = req.user?._id;
      console.log("M")
      try {
            // Get current month and year from the server
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            console.log("Fetching meals from:", startDate, "to", endDate);

            // Find meal plans for the user in the current month
            const mealPlans = await MealPlan.find({
                  user: userId,
                  date: { $gte: startDate, $lte: endDate },
            }).sort({ date: 1 });

            // Fetch recipe details for each meal plan
            const enrichedMealPlans = await Promise.all(
                  mealPlans.map(async (plan) => {
                        const mealTypes = ["Breakfast", "Brunch", "Lunch", "Snacks", "Dinner"];
                        let enrichedMeals = {};

                        for (const type of mealTypes) {
                              if (plan.mealPlan[type]) {
                                    const recipes = await Recipe.find({
                                          _id: { $in: plan.mealPlan[type].filter(id => id !== null) }
                                    }).select("title nutrition"); // Fetch only necessary fields

                                    enrichedMeals[type] = recipes;
                              } else {
                                    enrichedMeals[type] = [];
                              }
                        }

                        return {
                              ...plan.toObject(),
                              mealPlan: enrichedMeals, // Replace IDs with actual recipe details
                        };
                  })
            );

            return res.status(200).json(
                  new apiResponse(200, enrichedMealPlans, "Meal plans with recipes fetched successfully")
            );
      } catch (error) {
            console.error("Error fetching meal plans:", error);
            return next(new apiErrorHandler(500, "Error fetching meal plans"));
      }
});



const getMealNutritionsCurrentWeek = asyncHandler(async (req, res, next) => {
      const userId = req.user?._id;
      console.log("W")
      try {
            // Get the current date and calculate the current week's start (Sunday) and end (Saturday)
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            const startDate = new Date(now);
            startDate.setDate(now.getDate() - dayOfWeek);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(now);
            endDate.setDate(now.getDate() + (6 - dayOfWeek));
            endDate.setHours(23, 59, 59, 999);

            console.log("Fetching meals for current week from:", startDate, "to", endDate);

            // Find meal plans for the user in the current week
            const mealPlans = await MealPlan.find({
                  user: userId,
                  date: { $gte: startDate, $lte: endDate },
            }).sort({ date: 1 });

            // Fetch recipe details for each meal plan
            const enrichedMealPlans = await Promise.all(
                  mealPlans.map(async (plan) => {
                        const mealTypes = ["Breakfast", "Brunch", "Lunch", "Snacks", "Dinner"];
                        let enrichedMeals = {};

                        for (const type of mealTypes) {
                              if (plan.mealPlan[type]) {
                                    const recipes = await Recipe.find({
                                          _id: { $in: plan.mealPlan[type].filter(id => id !== null) }
                                    }).select("title nutrition"); // Fetch only necessary fields

                                    enrichedMeals[type] = recipes;
                              } else {
                                    enrichedMeals[type] = [];
                              }
                        }

                        return {
                              ...plan.toObject(),
                              mealPlan: enrichedMeals, // Replace IDs with actual recipe details
                        };
                  })
            );

            return res.status(200).json(
                  new apiResponse(200, enrichedMealPlans, "Meal plans with recipes for current week fetched successfully")
            );
      } catch (error) {
            console.error("Error fetching meal plans for current week:", error);
            return next(new apiErrorHandler(500, "Error fetching meal plans for current week"));
      }
});



export {
      getMealNutritions,
      getMealNutritionsCurrentWeek
};