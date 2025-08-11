import { model, Schema } from "mongoose";

const commentSchema = new Schema(
      {
            recipe: {
                  type: Schema.Types.ObjectId,
                  ref: "Recipe",
            },
            content: {
                  en: {
                        type: String,
                        trim: true,
                  },
                  ar: {
                        type: String,
                        trim: true,
                  }
            },
            user: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
            },
            parent: {
                  type: Schema.Types.ObjectId,
                  ref: "Comment",
                  default: null,
            },
            replies: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: "Comment",
                  },
            ],
            likes: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                  },
            ],
      },
      { timestamps: true }
);

const Comment = model("Comment", commentSchema);
export default Comment;
