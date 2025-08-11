import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

/**
 * Like or Unlike a Recipe
 * @route POST /api/recipes/:recipeId/like
 * @access Private
 */
const handleLikedRecipe = asyncHandler(async (req, res) => {
      const { recipeId } = req.params;
      const { _id: userId } = req.user; // from authenticated user

      // 1. Find the recipe
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
            return apiErrorHandler(res, 404, "Recipe not found");
      }

      // 2. Check if user already liked the recipe
      const alreadyLiked = recipe.likedBy.some(
            (id) => id.toString() === userId.toString()
      );

      if (alreadyLiked) {
            // 3a. Unlike
            recipe.likedBy = recipe.likedBy.filter(
                  (id) => id.toString() !== userId.toString()
            );
            await recipe.save();

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              recipe,
                              "Unliked the recipe successfully"
                        )
                  )
      } else {
            // 3b. Like
            recipe.likedBy.push(userId);
            await recipe.save();

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              recipe,
                              "Liked the recipe successfully"
                        )
                  )
      }
});

export default handleLikedRecipe;
