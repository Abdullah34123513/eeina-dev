import crypto from "crypto";
import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";


const setNewPassword = asyncHandler(async (req, res, next) => {
      const { password } = req.body;
      const { resetToken } = req.cookies;

      if (!resetToken || !password)
            return next(new apiErrorHandler(400, "Password or token is missing"));

      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) return next(new apiErrorHandler(400, "Token is invalid or expired"));

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.clearCookie("resetToken").status(200).json(new apiResponse(
            200,
            null,
            "Password reset successfully"
      ));
})

export default setNewPassword;