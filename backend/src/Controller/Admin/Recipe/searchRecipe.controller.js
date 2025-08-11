import Recipe from "../../../models/recipe/recipe.model.js";
import mongoose from "mongoose";
import { apiResponse } from "../../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../../Utils/asyncHandler.js";

export const adminQueryGetRecipe = asyncHandler(async (req, res) => {
      const { page = 1, limit = 10, keyword, imported } = req.query;
      const skip = (page - 1) * limit;

      // Base filter (imported flag)
      const mongoFilter = {};
      if (imported === "true") {
            mongoFilter["metadata.imported"] = true;
      }

      let recipes, total;
      if (keyword) {
            if (mongoose.Types.ObjectId.isValid(keyword)) {
                  // direct lookup by _id
                  const doc = await Recipe.findOne({
                        _id: keyword,
                        ...mongoFilter,
                  });
                  recipes = doc ? [doc] : [];
                  total = recipes.length;
            } else {
                  const regex = new RegExp(keyword, "i");

                  const searchFilter = {
                        ...mongoFilter,
                        $or: [
                              { "title.en": regex },
                              { "title.ar": regex },
                              { "description.en": regex },
                              { "description.ar": regex },
                              { "ingredients.nameClean.en": regex },
                              { "ingredients.nameClean.ar": regex },
                              { "ingredients.ingrText": regex },
                              { "ingredients.unit.en": regex },
                              { "ingredients.unit.ar": regex },
                              { "category.en": regex },
                              { "cuisine.en": regex },
                              { "cuisine.ar": regex },
                              { "healthLabels.en": regex },
                              { "healthLabels.ar": regex },
                              { "dietLabels.en": regex },
                              { "dietLabels.ar": regex },
                        ],
                  };

                  [recipes, total] = await Promise.all([
                        Recipe.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(+limit),
                        Recipe.countDocuments(searchFilter),
                  ]);
            }
      } else {
            // Regular find with pagination
            [recipes, total] = await Promise.all([
                  Recipe.find(mongoFilter).sort({ createdAt: -1 }).skip(skip).limit(+limit),
                  Recipe.countDocuments(mongoFilter),
            ]);
      }

      return res.json(new apiResponse(200, { recipes, total }, "Recipes fetched successfully"));
});
