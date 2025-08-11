import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getSingleRecipe = asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!id) {
            throw new apiErrorHandler(400, "Recipe id is required");
      }

      const recipe = await Recipe.findById(id)
            .populate({
                  path: "createdBy",
                  select: "firstName lastName image follower",
            })
            .populate({
                  path: "ingredients.details",
                  select: "name image",
            })
            .populate({
                  path: "category"
            })


            await Recipe.findByIdAndUpdate(id, { $inc: { views: 1 } }); // Incrementing the views

      if (!recipe) {
            throw new apiErrorHandler(404, "Recipe not found");
      }

      return res.status(200).json(
            new apiResponse(200, recipe, "Recipe found successfully")
      );
});

export default getSingleRecipe;
