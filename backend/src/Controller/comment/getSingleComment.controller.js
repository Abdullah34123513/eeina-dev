import Comment from "../../models/comment/comment.model.js";
import { apiResponse } from "../../Utils/apiResponseHandler.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

const editComment = asyncHandler(async (req, res) => {
      const { content } = req.body;
      const { id } = req.params;

      const comment = await Comment.findById(id);
      if (!comment) {
            return res
                  .status(404)
                  .json(new apiResponse(404, null, "Comment not found."));
      }

      comment.content = content;
      await comment.save();

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        { comment },
                        "Comment updated successfully."
                  )
            );
});

export { editComment };
