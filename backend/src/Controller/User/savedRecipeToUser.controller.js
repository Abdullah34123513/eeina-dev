import Recipe from "../../models/recipe/recipe.model.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const saveRecipeToUser = asyncHandler(async (req, res, next) => {
      const {
            id
      } = req.params;

      console.log(req.user._id);

      const user = await User.findById(req.user._id);
      if (!user) {
            throw new apiErrorHandler(404, "User not found");
      }

      const recipe = await Recipe.findById(id);
      if (!recipe) {
            throw new apiErrorHandler(404, "Recipe not found");
      }

      const isSaved = user.savedRecipes.includes(id);

      if (isSaved)
            throw new apiErrorHandler(400, "Recipe already saved");

      user.savedRecipes.push(id);
      await user.save({
            validateBeforeSave: false
      });

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {},
                        "Recipe saved successfully"
                  )
            );
});


const unsaveRecipeToUser = asyncHandler(async (req, res, next) => {
      const {
            id
      } = req.params;

      const user = await User.findById(req.user._id);
      if (!user) {
            throw new apiErrorHandler(404, "User not found");
      }

      const recipe = await Recipe.findById(id);
      if (!recipe) {
            throw new apiErrorHandler(404, "Recipe not found");
      }

      const isSaved = user.savedRecipes.includes(id);

      if (!isSaved)
            throw new apiErrorHandler(400, "Recipe not saved");

      user.savedRecipes.pull(id);
      await user.save({
            validateBeforeSave: false
      });

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {},
                        "Recipe unsaved successfully"
                  )
            );
})



const getSavedRecipes = asyncHandler(async (req, res, next) => {
      const user = await User.findById(req.user._id);
      if (!user) {
            throw new apiErrorHandler(404, "User not found");
      }

      const recipes = await Recipe.find({
            _id: {
                  $in: user.savedRecipes
            }
      }).populate({
            path:"createdBy",
            select:"firstName lastName image"
      })

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        recipes,
                        "Saved Recipes fetched successfully"
                  )
            );
});



export {
      saveRecipeToUser,
      unsaveRecipeToUser,
      getSavedRecipes
}