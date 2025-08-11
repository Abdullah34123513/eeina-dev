import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MessageSquareWarning, Send } from "lucide-react";
// import { Link } from "react-router-dom";

// API handler functions (adjust as needed)
import handlePostApi from "../../API/Handler/postApi.handler";
import handleEditApi from "../../API/Handler/editHandler.Api";
import handleDeleteApi from "../../API/Handler/deleteApi.handler";
import handleGetApi from "../../API/Handler/getApi.handler";

// Import the recursive CommentItem component
import CommentItem from "./CommentItem";
import UserAvatar from "../../Components/avatar/UseAvatar";
import { useLang } from "../../context/LangContext";

// Helper functions to update the nested comment tree
const updateCommentInTree = (comments, updatedComment) => {
      return comments.map((comment) => {
            if (comment._id === updatedComment._id) {
                  return {
                        ...comment,
                        content: updatedComment.content || comment.content,
                        likes: updatedComment.likes || comment.likes,
                  };
            }
            if (comment.replies && comment.replies.length > 0) {
                  return {
                        ...comment,
                        replies: updateCommentInTree(
                              comment.replies,
                              updatedComment
                        ),
                  };
            }
            return comment;
      });
};

const deleteCommentFromTree = (comments, commentId) => {
      return comments
            .filter((comment) => comment._id !== commentId)
            .map((comment) => ({
                  ...comment,
                  replies: comment.replies
                        ? deleteCommentFromTree(comment.replies, commentId)
                        : [],
            }));
};

const addCommentToTree = (comments, newComment) => {
      // If newComment has no parent, add it as a top-level comment.
      if (!newComment.parent) {
            return [newComment, ...comments];
      }
      // Otherwise, find its parent and add it into the parent's replies.
      const recursiveAdd = (commentsList) => {
            return commentsList.map((comment) => {
                  if (comment._id === newComment.parent) {
                        return {
                              ...comment,
                              replies: comment.replies
                                    ? [newComment, ...comment.replies]
                                    : [newComment],
                        };
                  }
                  if (comment.replies && comment.replies.length > 0) {
                        return {
                              ...comment,
                              replies: recursiveAdd(comment.replies),
                        };
                  }
                  return comment;
            });
      };
      return recursiveAdd(comments);
};

const RecipeComments = ({ recipeId, user, isAuthenticated }) => {
      const [comment, setComment] = useState("");
      const [commentsData, setCommentsData] = useState([]);
      // For edit modal
      const [editModalOpen, setEditModalOpen] = useState(false);
      const [editedCommentText, setEditedCommentText] = useState("");
      const [activeComment, setActiveComment] = useState(null);
      const { isArabic } = useLang();

      // Fetch nested comments from the API on mount and whenever recipeId changes.
      useEffect(() => {
            async function fetchComments() {
                  try {
                        const { data } = await handleGetApi(
                              `comment/${recipeId}`
                        );
                        setCommentsData(data);
                  } catch (error) {
                        console.error("Error fetching comments:", error);
                  }
            }
            fetchComments();
      }, [recipeId]);

      // Create a new top-level comment and update state on the fly.
      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!isAuthenticated) {
                  alert("Please login to comment.");
                  return;
            }
            try {
                  const res = await handlePostApi("comment/create", {
                        content: comment,
                        recipeId,
                  });
                  if (res.statusCode === 201) {
                        // Assume res.data contains the newly created comment.
                        const newComment = res.data;
                        setCommentsData((prev) =>
                              addCommentToTree(prev, newComment)
                        );
                        setComment("");
                  }
            } catch (error) {
                  console.error("Error creating comment:", error);
            }
      };

      // Open the edit modal.
      const handleEdit = (commentObj) => {
            setActiveComment(commentObj);
            setEditedCommentText(commentObj.content);
            setEditModalOpen(true);
      };

      // Update the comment on the fly.
      const handleUpdateComment = async () => {
            try {
                  const res = await handleEditApi(
                        `comment/edit/${activeComment._id}`,
                        {
                              content: editedCommentText,
                        }
                  );
                  if (res.statusCode === 200) {
                        console.log("editted: ", res);
                        // Update only the content in the nested tree.

                        setCommentsData((prev) =>
                              updateCommentInTree(prev, res.data)
                        );
                        setEditModalOpen(false);
                  }
            } catch (error) {
                  console.error("Error updating comment:", error);
            }
      };

      // Delete the comment and update state.
      const handleCommentDelete = async (commentId) => {
            const res = await handleDeleteApi("comment/delete", commentId, {
                  recipeId,
            });
            if (res.statusCode === 200) {
                  setCommentsData((prev) =>
                        deleteCommentFromTree(prev, commentId)
                  );
            } else {
                  console.error("Error deleting comment:", res);
            }
      };

      // Handle comment like and update the comment in state.
      const handleRecipeLike = async (commentID) => {
            try {
                  const res = await handlePostApi(`comment/like/${commentID}`);

                  if (res.statusCode === 200) {
                        const updatedComment = {
                              _id: commentID,
                              likes: res.data.likes,
                        };
                        setCommentsData((prev) =>
                              updateCommentInTree(prev, updatedComment)
                        );
                  }
            } catch (error) {
                  console.error("Error liking comment:", error);
            }
      };

      // Handle replying to a comment.
      const handleReply = async (parentId, replyContent) => {
            if (!isAuthenticated) {
                  alert("Please login to reply.");
                  return;
            }
            try {
                  const res = await handlePostApi("comment/create", {
                        content: replyContent,
                        recipeId,
                        parentId,
                  });
                  if (res.statusCode === 201) {
                        const newReply = res.data;
                        setCommentsData((prev) =>
                              addCommentToTree(prev, newReply)
                        );
                  }
            } catch (error) {
                  console.error("Error creating reply:", error);
            }
      };

      return (
            <div>
                  <h1 className="text-2xl font-semibold p-6 border-b border-gray-200 text-primary">
                        {
                              isArabic
                                    ? "التعليقات"
                                    : "Comments"
                        }
                  </h1>

                  {/* Render nested comments recursively */}
                  {/* Comments List */}
                  <div className="p-4 space-y-6">
                        {commentsData?.length > 0 ? (
                              commentsData.map((commentObj) => (
                                    <CommentItem
                                          key={commentObj._id}
                                          comment={commentObj}
                                          user={user}
                                          recipeId={recipeId}
                                          isAuthenticated={isAuthenticated}
                                          onEdit={handleEdit}
                                          onDelete={handleCommentDelete}
                                          onLike={handleRecipeLike}
                                          onReply={handleReply}
                                    />
                              ))
                        ) : (
                              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                                    <MessageSquareWarning
                                          size={40}
                                          className="text-gray-300 mb-2"
                                    />
                                    <p className="text-gray-400">
                                          {
                                                isArabic
                                                      ? "كن أول من يعلق على هذه الوصفة!"
                                                      : "Be the first to comment on this recipe!"
                                          }
                                    </p>
                              </div>
                        )}
                  </div>

                  {/* Comment submission form */}
                  <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100">
                        <div className="flex gap-3 items-start">
                              <div className="shrink-0">
                                    <UserAvatar user={user} size="md" />
                              </div>
                              <div className="flex-1 relative"
                              >
                                    <textarea
                                          value={comment}
                                          onChange={(e) => setComment(e.target.value)}
                                          placeholder={
                                                isArabic
                                                      ? "اكتب تعليقك هنا..."
                                                      : "Write your comment here..."
                                          }
                                          dir={isArabic ? "rtl" : "ltr"}
                                          className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-400 resize-none bg-gray-50"
                                    />
                                    <button
                                          type="submit"
                                          className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                          <Send size={20} />
                                    </button>
                              </div>
                        </div>
                  </form>

                  {/* Edit Comment Modal */}
                  {editModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                              <div
                                    className="absolute inset-0 bg-black opacity-50"
                                    onClick={() => setEditModalOpen(false)}
                              ></div>
                              <div className="bg-white rounded-lg p-6 z-50 w-11/12 max-w-md">
                                    <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>
                                    <textarea
                                          value={editedCommentText}
                                          onChange={(e) => setEditedCommentText(e.target.value)}
                                          rows="4"
                                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                    <div className="mt-4 flex justify-end space-x-2">
                                          <button
                                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                                onClick={() => setEditModalOpen(false)}
                                          >
                                                Cancel
                                          </button>
                                          <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                onClick={handleUpdateComment}
                                          >
                                                Save
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
};

RecipeComments.propTypes = {
      recipeId: PropTypes.string.isRequired,
      user: PropTypes.object.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
};

export default RecipeComments;
