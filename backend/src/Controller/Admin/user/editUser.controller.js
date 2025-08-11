import { asyncHandler } from "../../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../../Utils/apiResponseHandler.js";
import User from "../../../models/user.model.js";

const adminEditUser = asyncHandler(async (req, res, next) => {
      const isSuperAdmin = req.user.role === "super-admin";
      const { role } = req.body;
      const userId = req.params.id;

      console.log("role", role);
      console.log("userId", userId);

      // Check if user exists
      const user = await User.findById(userId);

      console.log("user", user);
      
      if (!user) {
            return next(new apiErrorHandler(404, "User not found"));
      }

      // Prevent editing oneself
      if (req.user._id.toString() === userId) {
            return next(new apiErrorHandler(400, "You can't edit yourself"));
      }

      if (isSuperAdmin) {
            if (role === "super-admin") {
                  // Elevate user to super-admin, and demote current user to admin
                  user.role = "super-admin";
                  await user.save();
                  await User.findByIdAndUpdate(req.user._id, { role: "admin" });
            } else {
                  // super-admin can change the role to any allowed role
                  user.role = role;
                  await user.save();
            }
      } else {
            // Admin can only promote others to admin
            if (role === "admin") {
                  user.role = "admin";
                  await user.save();
            } else {
                  return next(
                        new apiErrorHandler(
                              400,
                              "Sorry, you can't perform this action"
                        )
                  );
            }
      }

      return res.json(
            new apiResponse(200, user, "User role updated successfully")
      );
});

export default adminEditUser;
