import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return next(new apiErrorHandler(400, "Email and OTP are required"));

    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) {
        return next(new apiErrorHandler(404, "User not found"));
    }

    const isVerified = await user.verifyOTP(otp);
    if (!isVerified) {
        return next(new apiErrorHandler(400, "Invalid or expired OTP"));
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json(new apiResponse(
        200,
        null,
        "Email verified successfully"
    ));
});


