import Recipe from "../../models/recipe/recipe.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const AllImportRecipeGet = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;
      const skip = (page - 1) * limit;

      const totalRecipes = await Recipe.countDocuments({ "metadata.imported": true });
      const importedRecipes = await Recipe.find({ "metadata.imported": true }).skip(skip).limit(limit);

      return res.status(200).json(
            new apiResponse(200, { recipes: importedRecipes, total: totalRecipes }, "Imported recipes retrieved successfully.")
      );
});

export { AllImportRecipeGet };
