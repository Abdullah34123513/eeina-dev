import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getUserDetails = asyncHandler(async (req, res, next) => {
      // Destructure the id from request parameters
      const { id } = req.params;

      // Find the user by the provided id
      const user = await User.findById(id);

      if (!user) {
            throw new apiErrorHandler(404, "User not found");
      }

      // Build a response object containing selected user details
      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        user,
                        "User profile fetched successfully"
                  )
            );
});

export default getUserDetails;
