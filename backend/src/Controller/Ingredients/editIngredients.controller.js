import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";

const editIngredients = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const ingredient = await Ingredient.findById(id);

      if (!ingredient) {
            return next(new apiErrorHandler(404, "Ingredient not found"));
      }

      const image = req.file;

      if (image) {
            const { imageUrl, key } = await uploadMediaUserDevice(
                  image.path,
                  image.filename
            );
            ingredient.image = {
                  key,
                  url: imageUrl,
            };
      }

      await ingredient.save();

      return res
            .status(200)
            .json(new apiResponse(200, ingredient, "Ingredient updated"));
});

export default editIngredients;
