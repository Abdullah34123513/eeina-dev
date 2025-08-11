import User from "../../models/user.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";


const followUser = asyncHandler(async (req, res, next) => {

      const {
            id
      } = req.params;


      const loggedInUser = await User.findById(req.user._id);
      if (!loggedInUser) {
            throw new apiErrorHandler(404, "User not found");
      }

      const followUser = await User.findById(id);
      if (!followUser) {
            throw new apiErrorHandler(404, "User not found");
      }

      const isFollowing = followUser.follower.includes(req.user._id);

      if (isFollowing)
            throw new apiErrorHandler(400, "You are already following this user");

      followUser.follower.push(req.user._id);
      await followUser.save({
            validateBeforeSave: false
      });

      loggedInUser.following.push(id);
      await loggedInUser.save({
            validateBeforeSave: false
      });

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {},
                        "User followed successfully"
                  )
            );

});



const unfollowUser = asyncHandler(async (req, res, next) => {

      const {
            id
      } = req.params;

      const loggedInUser = await User.findById(req.user._id);
      if (!loggedInUser) {
            throw new apiErrorHandler(404, "User not found");
      }

      const followUser = await User.findById(id);
      if (!followUser) {
            throw new apiErrorHandler(404, "User not found");
      }

      const isFollowing = followUser.follower.includes(req.user._id);

      if (!isFollowing)
            throw new apiErrorHandler(400, "You are not following this user");

      followUser.follower.pull(req.user._id);
      await followUser.save({
            validateBeforeSave: false
      });

      loggedInUser.following.pull(id);
      await loggedInUser.save({
            validateBeforeSave: false
      });

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {},
                        "User unfollowed successfully"
                  )
            );
})



export {
      followUser,
      unfollowUser
};