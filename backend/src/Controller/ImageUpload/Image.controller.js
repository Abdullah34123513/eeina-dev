import { uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const ImageUploadController = asyncHandler(async (req, res) => {

      const {
            path,
            filename
      } = req?.file;

      if (!path || !filename)
            throw new apiErrorHandler("File not uploaded.", 400);

      console.log("Image path:", path);
      console.log("Image filename:", filename);

      const imageUploadRes = await uploadMediaUserDevice(path, filename, "uploads/temp");

      if (!imageUploadRes)
            throw new apiErrorHandler("Failed to upload image.", 500);

      console.log("Image uploaded successfully.", imageUploadRes);


      return res
            .status(201)
            .json(
                  new apiResponse(
                        201,
                        { url: imageUploadRes.imageUrl, key: imageUploadRes.key },
                        "Image uploaded successfully."
                  )
            );

});


export { ImageUploadController };