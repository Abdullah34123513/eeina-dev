import MealPlan from "../../models/mealPlanner/mealPlanner.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const createMealPlanner = asyncHandler(async (req, res) => {
      try {
            // Assume the user ID is set by your authentication middleware
            const userId = req.user._id;
            const { date, mealPlan } = req.body;

            if (!date || !mealPlan) {
                  throw new apiErrorHandler("Date and meal plan are required");
            }

            const planDate = new Date(date);

            // Upsert: update the plan if it exists or create a new one
            const updatedPlan = await MealPlan.findOneAndUpdate(
                  { user: userId, date: planDate },
                  { mealPlan },
                  { new: true, upsert: true }
            );

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedPlan,
                              "Meal plan saved successfully"
                        )
                  );

      } catch (error) {
            console.error("Error saving meal plan:", error);
            throw new apiErrorHandler("Error saving meal plan");
      }
});

export default createMealPlanner;