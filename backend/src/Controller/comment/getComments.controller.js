import mongoose from "mongoose";
import Comment from "../../models/comment/comment.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const nestComments = (comments, parentId = null) => {
      return comments
            .filter((comment) => String(comment.parent) === String(parentId))
            .map((comment) => {
                  // Convert to a plain object if needed
                  const commentObj = comment.toObject();
                  // Recursively find children of the current comment
                  commentObj.replies = nestComments(comments, comment._id);
                  return commentObj;
            });
};

export const getComments = asyncHandler(async (req, res, next) => {
      const { recipeId } = req.params;
      console.log(recipeId);

      const { _id } = req.user;

      const comments = await Comment.find({
            recipe: new mongoose.Types.ObjectId(recipeId),
      })
      .populate("user", "firstName lastName image")
      .exec();

      const nestedComments = nestComments(comments);

      return res.json(
            new apiResponse(
                  200,
                  nestedComments,
                  "Comments fetched successfully"
            )
      );
});
