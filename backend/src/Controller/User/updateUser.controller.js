
import { uploadMediaUserDevice } from "../../Handlers/AWSUpload.js";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import calculateDailyNeeds from "../../Utils/UserDailyNeedCalcu/UserDailyNeedCalcu.js";

const updateUser = asyncHandler(async (req, res) => {
      try {
            const { _id } = req.user; // Assuming user ID is passed as a parameter
            const updates = req.body;




            // Find the existing user data
            const user = await User.findById(_id);
            if (!user) {
                  console.error("User not found");
                  throw new apiErrorHandler(404, "User not found");
            }

            let requiresRecalculation = false;
            const fieldsToCheck = ["height", "weight", "dob", "activityLevel"];

            // Iterate over update fields and modify only changed ones
            Object.keys(updates).forEach((key) => {
                  if (user[key] !== updates[key]) {
                        console.log(`Updating field: ${key}, Old Value: ${user[key]}, New Value: ${updates[key]}`);
                        user[key] = updates[key];
                        if (fieldsToCheck.includes(key)) {
                              requiresRecalculation = true;
                        }
                  }
            });

            // Placeholder function for recalculating BMR, TDEE, etc.
            if (requiresRecalculation) {
                  // Convert weight and height to numbers. Other values (dob, gender, activityLevel) remain as strings.
                  const height = Number(updates.height || user.height);
                  const weight = Number(updates.weight || user.weight);
                  const dob = updates.dob || user.dob;
                  const activityLevel = updates.activityLevel || user.activityLevel;
                  const gender = updates.gender || user.gender;

                  // Debug log: check the types and values
                  console.log("Calculating daily needs with:", {
                        weight,
                        height,
                        dob,
                        gender,
                        activityLevel,
                  });

                  const {
                        bmr,
                        tdee,
                        calorieGoal,
                        proteinGrams,
                        fatGrams,
                        carbGrams,
                        sugarGrams
                  } = await calculateDailyNeeds({ weight, height, dob, gender, activityLevel });

                  console.log(
                        "Recalculated values:",
                        bmr,
                        tdee,
                        calorieGoal,
                        proteinGrams,
                        fatGrams,
                        carbGrams,
                        sugarGrams
                  );

                  user.bmr = bmr;
                  user.tdee = tdee;
                  user.calorieGoal = calorieGoal;
                  user.proteinGoal = proteinGrams;
                  user.fatGoal = fatGrams;
                  user.carbGoal = carbGrams;
                  user.sugarGoal = sugarGrams;
            }


            await user.save({
                  validateBeforeSave: false // Disable validation to prevent errors
            });
            console.log("User profile updated successfully");
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              user,
                              "User profile updated successfully",
                        )
                  )
      } catch (error) {
            console.error("Error updating user:", error);
            throw new apiErrorHandler(500, "Error updating user");
      }
});


export default updateUser;