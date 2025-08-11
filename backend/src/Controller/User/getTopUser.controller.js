import User from "../../models/user.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const getTopCreators = asyncHandler(async (req, res) => {
      const users = await User.aggregate([
            {
                  $addFields: {
                        followerCount: { $size: "$follower" },
                  },
            },
            {
                  $sort: { followerCount: -1 },
            },
            { $limit: 10 },
      ]);

      return res
            .status(200)
            .json(new apiResponse(200, users, "Top 10 creators fetched successfully"));
});

export default getTopCreators;
