import { asyncHandler } from "../../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../../Utils/apiResponseHandler.js";
import User from "../../../models/user.model.js";

const deleteUser = asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
            return next(new apiErrorHandler(404, "User not found"));
      }

      if (user.role === "master") {
            return next(
                  new apiErrorHandler(400, "Master user can't be deleted")
            );
      }

      if (req.user._id.toString() === id) {
            return next(new apiErrorHandler(400, "You can't delete yourself"));
      }

      await User.findByIdAndDelete(id);
      return res
            .status(200)
            .json(new apiResponse(200, null, "User deleted successfully"));
});

export default deleteUser;
