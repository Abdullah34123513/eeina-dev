import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";

const createIngredients = asyncHandler(async (req, res, next) => {
      const { name } = req.body;
      const image = req.file;

      if (!image) {
            return next(
                  new apiErrorHandler(
                        400,
                        "Please provide an image for the category."
                  )
            );
      }

      // upload image to S3 bucket and get return values
      const { imageUrl, key } = await uploadMediaUserDevice(
            image.path,
            image.filename
      );

      if (!imageUrl || !key) {
            return next(
                  new apiErrorHandler(
                        500,
                        "Failed to upload the image to the server."
                  )
            );
      }
      const ingredient = await Ingredient.create({
            name,
            image: {
                  key,
                  url: imageUrl,
            },
      });

      return res
            .status(201)
            .json(new apiResponse(201, ingredient, "Ingredient created"));
});

export default createIngredients;
