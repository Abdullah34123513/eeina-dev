import User from "../../models/user.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
      // Use MongoDB's $sample operator to get a random user
      // const user = await User.aggregate([{ $sample: { size: 1 } }]);
      // remove currently logged in user from the list
      const user = await User.find();

      return res
            .status(200)
            .json(new apiResponse(200, user, "Random user fetched successfully"));
});

export default getAllUser;
