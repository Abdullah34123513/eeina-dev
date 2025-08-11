import { emailVerificationConfig } from "../../Configs/email.config.js";
import User from "../../models/user.model.js";
import { transporter } from "../../Services/mailSender.service.js";
import { translateTexts } from "../../Services/translator.service.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import calculateDailyNeeds from "../../Utils/UserDailyNeedCalcu/UserDailyNeedCalcu.js";

const registerUser = asyncHandler(async (req, res) => {
      const { firstName: firstNameStr, lastName: lastNameStr, email, password } = req.body;

      if (!firstNameStr || !lastNameStr || !email || !password) {
            throw new apiErrorHandler(400, "Please fill all fields");
      }

      // Helper function to detect Arabic text
      const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

      // Batch process both names together
      const processNames = async (firstName, lastName) => {
            try {
                  const isArFirstName = isArabic(firstName);
                  // Use en-US instead of deprecated 'en'
                  const targetLang = isArFirstName ? 'en-US' : 'ar';

                  const translatedNames = await translateTexts([firstName, lastName], targetLang);

                  return {
                        firstName: {
                              en: isArFirstName ? translatedNames[0] : firstName,
                              ar: isArFirstName ? firstName : translatedNames[0]
                        },
                        lastName: {
                              en: isArFirstName ? translatedNames[1] : lastName,
                              ar: isArFirstName ? lastName : translatedNames[1]
                        }
                  };
            } catch (error) {
                  console.error('Translation error:', error.message);
                  return {
                        firstName: isArabic(firstName) ? { ar: firstName } : { en: firstName },
                        lastName: isArabic(lastName) ? { ar: lastName } : { en: lastName }
                  };
            }
      };

      // Process both names in single translation call
      const { firstName: processedFirstName, lastName: processedLastName } =
            await processNames(firstNameStr, lastNameStr);

      const newUser = new User({
            firstName: processedFirstName,
            lastName: processedLastName,
            email,
            password,
            username: email.split("@")[0].toLowerCase(),
            lastLogin: Date.now(),
      });

      const user = await newUser.save()

      if (!user) {
            throw new apiErrorHandler(400, "User registration failed");
      }

      // generate confirmation email
      const email_verification_code = await user.generateOTP();

      await user.save({ validateBeforeSave: false });


      const mailOption = emailVerificationConfig({
            userEmail: email,
            userName: processedFirstName.en || processedFirstName.ar,
            email_verification_code: email_verification_code
      });

      await transporter.sendMail(mailOption);

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        null,
                        "User registered successfully"
                  )
            );
});

const updateGenderAndAge = asyncHandler(async (req, res) => {
      const data = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
            throw new apiErrorHandler(400, "User not found");
      }

      user.dob = data.dob
      user.gender = data.gender;

      await user.save(
            {
                  validateBeforeSave: false,
            }
      );

      return res.status(200).json(
            new apiResponse(
                  200,
                  user,
                  "User personal data updated successfully"
            )
      );

});


const updateOtherDataToCalCalories = asyncHandler(async (req, res) => {
      const {
            height,
            weight,
            activityLevel
      } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
            throw new apiErrorHandler(400, "User not found");
      }

      const {
            dob,
            gender
      } = user

      console.log(dob, gender)



      if (height && weight && activityLevel) {
            const {
                  bmr,
                  tdee,
                  calorieGoal,
                  proteinGrams,
                  fatGrams,
                  carbGrams,
                  sugarGrams
            } = await calculateDailyNeeds({ weight, height, dob, gender, activityLevel });

            user.bmr = bmr;
            user.tdee = tdee;
            user.calorieGoal = calorieGoal;
            user.proteinGoal = proteinGrams;
            user.fatGoal = fatGrams;
            user.carbGoal = carbGrams;
            user.sugarGoal = sugarGrams;
            user.height = height;
            user.weight = weight;
            user.activityLevel = activityLevel;

            await user.save({
                  validateBeforeSave: false
            });
      }


      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        user,
                        "User profile updated successfully"
                  )
            );
});

export {
      registerUser,
      updateGenderAndAge,
      updateOtherDataToCalCalories,
};
