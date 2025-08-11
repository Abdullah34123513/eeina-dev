import { uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import Categories from "../../models/categories/Categories.model.js";

export const createCategory = asyncHandler(async (req, res, next) => {
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

      const category = await Categories.create({
            name,
            image: {
                  key,
                  url: imageUrl,
            },
      });

      return res
            .status(201)
            .json(
                  new apiResponse(
                        201,
                        category,
                        "Category created successfully."
                  )
            );
});
