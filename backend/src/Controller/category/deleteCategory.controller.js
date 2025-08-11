import Categories from "../../models/categories/Categories.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { deleteMedia } from "../../Handlers/AWSUpload.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";

export const deleteCategory = asyncHandler(async (req, res, next) => {
      const { id } = req.params;

      const category = await Categories.findById(id);

      if (!category) {
            return next(new apiErrorHandler(404, "Category not found"));
      }

      try {
            await deleteMedia(category.image.key);
      } catch (error) {}

      await Categories.findByIdAndDelete(id);

      return res
            .status(200)
            .json(new apiResponse(200, null, "Category deleted successfully"));
});
