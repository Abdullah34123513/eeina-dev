import { otpMailConfig } from "../../Configs/email.config.js";
import User from "../../models/user.model.js";
import { transporter } from "../../Services/mailSender.service.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const SendOtpForForgottenUserEmail = asyncHandler(async (req, res, next) => {
      const { email } = req.body;

      if (!email)
            return next(new apiErrorHandler(400, "Email is required"));
      const user = await User.findOne({ email });

      if (!user)
            return next(new apiErrorHandler(404, "User not found"));

      //generate otp
      const otp = await user.generateOTP();

      // Send acknowledgment email to the client
      const clientMailOption = otpMailConfig({
            userEmail: email,
            otp,
      });

      await user.save({ validateBeforeSave: false });
      transporter.sendMail(clientMailOption);

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        null,
                        "OTP sent successfully"
                  )
            )

})

export { SendOtpForForgottenUserEmail }