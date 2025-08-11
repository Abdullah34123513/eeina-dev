import Comment from "../../models/comment/comment.model.js";
import Recipe from "../../models/recipe/recipe.model.js";
import { apiErrorHandler } from "../../Utils/apiErrorHandler.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

// Recursive function to delete all nested replies of a comment
const deleteNestedReplies = async (commentId) => {
      // Find all direct replies for this comment
      const replies = await Comment.find({ parent: commentId });
      for (const reply of replies) {
            // Recursively delete any replies for the current reply
            await deleteNestedReplies(reply._id);
            await Recipe.findByIdAndUpdate(reply.recipe, {
                  $pull: { comments: reply._id },
            });
            await Comment.findByIdAndDelete(reply._id);
      }
};

const deleteComment = asyncHandler(async (req, res, next) => {
      const { content, recipeId } = req.body;
      const { _id: userId } = req.user;
      const { id: commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment) {
            return next(new apiErrorHandler(404, "Comment not found."));
      }

      if (comment.user.toString() !== userId.toString()) {
            throw new apiErrorHandler(
                  403,
                  "You are not authorized to delete this comment."
            );
      }

      await deleteNestedReplies(comment._id);

      // Remove the comment reference from its parent (if it is a reply) or from the recipe (if it is a main comment)
      if (comment.parent) {
            await Comment.findByIdAndUpdate(comment.parent, {
                  $pull: { replies: comment._id },
            });
      } else {
            await Recipe.findByIdAndUpdate(comment.recipe, {
                  $pull: { comments: comment._id },
            });
      }

      // Finally, delete the comment itself
      await Comment.findByIdAndDelete(comment._id);

      return res
            .status(200)
            .json(new apiResponse(200, null, "Comment deleted successfully."));
});

export default deleteComment;
