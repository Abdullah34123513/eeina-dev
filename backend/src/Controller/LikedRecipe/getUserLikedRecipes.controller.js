import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const getUserLikedRecipes = asyncHandler(async (req, res) => {
      const { _id } = req?.user;


      const recipes = await Recipe.find({ likedBy: _id }).populate({
            path:"createdBy",
            name: "firstName lastName image"
      })


      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        recipes,
                        "User liked recipes"
                  )
            )

});



export default getUserLikedRecipes;