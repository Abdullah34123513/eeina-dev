import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const userOtpVerification = asyncHandler(async (req, res, next) => {
      const { email, otp } = req.body;


      if (!email || !otp)
            throw new apiErrorHandler(400, "Email and OTP are required");

      const user = await User.findOne({ email }).select("+otp +otpExpires");

      console.log(user);

      if (!user)
            throw new apiErrorHandler(404, "User not found");

      const isOtpValid = await user.verifyOTP(otp);

      console.log(user.otp, otp);

      if (!isOtpValid)
            return next(new apiErrorHandler(400, "Invalid OTP"));

      user.otp = null;

      const resetToken = await user.generateResetPasswordToken();

      await user.save({ validateBeforeSave: false });

      return res
            .cookie("resetToken", resetToken, {
                  httpOnly: true,
                  expires: new Date(Date.now() + 10 * 60 * 1000),
                  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                  secure: process.env.NODE_ENV === "production" ? true : false,
            })
            .status(200)
            .json(new apiResponse(
                  200,
                  null,
                  "OTP verified successfully, you can now reset your password"
            ));
});

export { userOtpVerification };
