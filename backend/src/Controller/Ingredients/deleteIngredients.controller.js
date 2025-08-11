import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { deleteMedia, uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";

const deleteIngredients = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const ingredient = await Ingredient.findById(id);

      if (!ingredient) {
            return next(new apiErrorHandler(404, "Ingredient not found"));
      }

      await deleteMedia(ingredient.image.key); // remove image from S3 bucket

      await Ingredient.findByIdAndDelete(id);

      return res
            .status(200)
            .json(new apiResponse(200, null, "Ingredient deleted"));
});

export default deleteIngredients;
