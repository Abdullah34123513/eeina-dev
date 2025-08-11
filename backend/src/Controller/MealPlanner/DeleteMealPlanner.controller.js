import MealPlan from "../../models/mealPlanner/mealPlanner.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const deleteMealPlanner = asyncHandler(async (req, res) => {
      try {
            const userId = req.user._id;
            const { date } = req.params;

            if (!date) {
                  throw new apiErrorHandler("Date is required");
            }

            const planDate = new Date(date);
            const deletedPlan = await MealPlan.findOneAndDelete({ user: userId, date: planDate });

            if (!deletedPlan) {
                  throw new apiErrorHandler("Meal plan not found");
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              deletedPlan,
                              "Meal plan deleted successfully"
                        )
                  );
      } catch (error) {
            console.error("Error deleting meal plan:", error);
            throw new apiErrorHandler("Error deleting meal plan");
      }
});

export default deleteMealPlanner;