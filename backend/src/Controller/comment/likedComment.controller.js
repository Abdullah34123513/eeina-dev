import Comment from "../../models/comment/comment.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";

const likedComment = asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { _id } = req.user;

      console.log("Comment ID:", id, "User ID:", _id);

      // Use findById to get a single comment document
      const comment = await Comment.findById(id);

      if (!comment) {
            throw new apiErrorHandler(res, 404, "Comment not found");
      }

      // Check if the user already liked the comment
      const alreadyLiked = comment.likes.some(
            (likeId) => likeId.toString() === _id.toString()
      );

      if (alreadyLiked) {
            // If liked, remove the like
            comment.likes = comment.likes.filter(
                  (likeId) => likeId.toString() !== _id.toString()
            );
            await comment.save();

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              comment,
                              "Unliked the comment successfully"
                        )
                  );
      } else {
            // Otherwise, add the like
            comment.likes.push(_id);
            // Disable validation if necessary
            await comment.save({ validateBeforeSave: false });

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              comment,
                              "Liked the comment successfully"
                        )
                  );
      }
});

export default likedComment;
