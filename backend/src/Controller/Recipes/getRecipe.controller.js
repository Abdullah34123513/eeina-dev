import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getRecipe = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const skip = (page - 1) * limit;

      try {
            const recipes = await Recipe.find()
                  .populate({
                        path: "createdBy",
                        select: "firstName lastName image",
                  })
                  .skip(skip)
                  .limit(limit);

            if (!recipes || recipes.length === 0) {
                  return res
                        .status(200)
                        .json(new apiResponse(200, [], "No recipes found."));
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              recipes,
                              "Recipes retrieved successfully."
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(error, 400);
      }
});

export default getRecipe;
