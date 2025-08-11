import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getRandomRecipes = asyncHandler(async (req, res) => {
      const limit = parseInt(req.query.limit) || 10;
      const skip = parseInt(req.query.skip) || 0;
      try {
            const recipes = await Recipe.aggregate([
                  { $addFields: { random: { $rand: {} } } },
                  { $sort: { random: 1 } },
                  { $skip: skip },
                  { $limit: limit },
                  {
                        $lookup: {
                              from: "users",
                              localField: "createdBy",
                              foreignField: "_id",
                              as: "createdBy",
                        },
                  },
                  { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
                  {
                        $project: {
                              random: 0,
                              "createdBy.password": 0,
                              "createdBy.__v": 0,
                        },
                  },
            ]);

            return res
                  .status(200)
                  .json(new apiResponse(200, recipes, "Recipes retrieved successfully."));
      } catch (error) {
            throw new apiErrorHandler(error, 400);
      }
});


export default getRandomRecipes;
