import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getTopIngredients = asyncHandler(async (req, res) => {
      try {
            const topIngredients = await Recipe.aggregate([
                  { $unwind: "$ingredients" }, // Flatten the ingredients array
                  {
                        $group: {
                              _id: "$ingredients.nameClean", // Group by cleaned ingredient name
                              count: { $sum: 1 } // Count occurrences
                        }
                  },
                  { $sort: { count: -1 } }, // Sort descending by count
                  { $limit: 25 } // Limit to top 25
            ]);

            return res
                  .status(200)
                  .json(new apiResponse(200, topIngredients, "Top ingredients fetched successfully"));
      } catch (error) {
            // Directly return the error response using your error handler
            return apiErrorHandler(res, error);
      }
});

export default getTopIngredients;
