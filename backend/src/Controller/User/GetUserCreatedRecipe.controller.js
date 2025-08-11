import Recipe from "../../models/recipe/recipe.model.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const getUserCreatedRecipe = asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!id) {
            throw new apiErrorHandler(401, "Unauthorized");
      }

      const userRecipes = await Recipe.find({
            createdBy: id
      }).populate({
            path: "createdBy",
            select: "firstName lastName image",
      });


      return res
            .status(201)
            .json(
                  new apiResponse(
                        201,
                        userRecipes,
                        "User recipes fetched successfully"
                  )
            );


});


export default getUserCreatedRecipe;