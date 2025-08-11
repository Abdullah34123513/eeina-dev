import User from "../../models/user.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const getUserProfile = asyncHandler(async (req, res, next) => {
      const user = await User.findById(req.user._id);
      return res.json(
            new apiResponse(
                  200,
                  {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isEmailVerified: user.isEmailVerified,
                        username: user.username,
                        image: user.image,
                        role: user.role,
                        savedRecipes: user.savedRecipes,
                        following: user.following,
                        follower: user.follower,
                        dob: user.dob,
                        gender: user.gender,
                        height: user.height,
                        weight: user.weight,
                        activityLevel: user.activityLevel,
                        calorieGoal: user.calorieGoal,
                        proteinGoal: user.proteinGoal,
                        carbGoal: user.carbGoal,
                        fatGoal: user.fatGoal,
                        sugarGoal: user.sugarGoal,
                  },
                  "User profile fetched successfully"
            )
      );
});
