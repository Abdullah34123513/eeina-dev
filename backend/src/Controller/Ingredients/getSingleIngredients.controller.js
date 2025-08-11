import Ingredient from "../../models/Ingredient/Ingredient.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getSingleIngredient = asyncHandler(async (req, res) => {
      const { id } = req.params;
      const ingredient = await Ingredient.findById(id);
      if (!ingredient) {
            return apiErrorHandler(res, "No ingredient found", 404);
      }
      return res
            .status(200)
            .json(new apiResponse(200, ingredient, "Ingredients found"));
});

export default getSingleIngredient;
