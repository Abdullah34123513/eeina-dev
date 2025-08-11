import Recipe from "../../models/recipe/recipe.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";

const getPopularRecipe = asyncHandler(async (req, res, next) => {
      try {
            const popularRecipes = await Recipe.find({})
                  .sort({ "likes.length": -1, "views": -1 }) // Sort by likes first, then views
                  .limit(10).populate({
                        path:"createdBy",
                        select:"firstName lastName image"
                  })

            return res.status(200).json(
                  new apiResponse(200, popularRecipes, "Popular recipes retrieved successfully.")
            );
      } catch (error) {
            console.log(error);
            throw new apiErrorHandler(500, "Internal Server Error", error);
      }
});

export default getPopularRecipe;
