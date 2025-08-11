import { deleteMedia } from "../../Handlers/AWSUpload.js";
import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const deleteSingleRecipe = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const { user } = req;

      if (!id) return next(new apiErrorHandler(400, "Recipe ID is required"));

      const recipe = await Recipe.findById(id);

      if (!recipe) {
            return next(new apiErrorHandler(404, "Recipe not found"));
      }


      if (
            !(
                  user.role === "admin" ||
                  user.role === "super-admin" ||
                  recipe.createdBy.toString() === user._id.toString()
            )
      ) {
            return next(
                  new apiErrorHandler(
                        403,
                        "You are not authorized to delete this recipe"
                  )
            );
      }

      // Remove media files if they exist
      if (recipe.thumbnail?.key) {
            await deleteMedia(recipe.thumbnail.key);
      }

      if (recipe.otherImages?.length > 0) {
            await Promise.all(
                  recipe.otherImages.map((image) => deleteMedia(image.key))
            );
      }

      // todos delte comments

      // Delete the recipe from the database
      await Recipe.findByIdAndDelete(id);

      return res
            .status(200)
            .json(new apiResponse(200, recipe, "Recipe deleted successfully"));
});

export default deleteSingleRecipe;
