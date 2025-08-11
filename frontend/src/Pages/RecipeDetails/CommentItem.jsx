import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { EllipsisVertical, Heart, Send } from "lucide-react";
import PropTypes from "prop-types";
import UserAvatar from "../../Components/avatar/UseAvatar";
import { useLang } from "../../context/LangContext";

const CommentItem = ({
      comment,
      user,
      recipeId,
      isAuthenticated,
      onEdit,
      onDelete,
      onLike,
      onReply,
      depth = 0,
}) => {
      const [dropdownVisible, setDropdownVisible] = useState(false);
      const [replying, setReplying] = useState(false);
      const [replyText, setReplyText] = useState("");
      const dropdownRef = useRef(null);
      const { isArabic } = useLang();

      const toggleDropdown = () => {
            setDropdownVisible((prev) => !prev);
      };

      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (
                        dropdownRef.current &&
                        !dropdownRef.current.contains(event.target)
                  ) {
                        setDropdownVisible(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                  document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const handleReplySubmit = (e) => {
            e.preventDefault();
            if (replyText.trim() === "") return;
            onReply(comment._id, replyText);
            setReplyText("");
            setReplying(false);
      };

      return (
            <div className="group relative">
                  <div className={`ml-4 pl-6 ${depth > 0 ? "border-l-2 border-gray-100" : ""}`}>
                        <div className="flex gap-4 items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                              {/* User Avatar */}
                              <Link
                                    to={`/creators/${comment?.user?._id}`}
                                    className="shrink-0 mt-1"
                              >
                                    <UserAvatar user={comment.user} size="sm" />
                              </Link>

                              {/* Comment Content */}
                              <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                          <div>
                                                <Link
                                                      to={`/creators/${comment?.user?._id}`}
                                                      className="font-medium hover:text-primary transition-colors"
                                                >
                                                      {comment?.user?.firstName && comment?.user?.lastName
                                                            ? isArabic
                                                                  ? `${comment?.user.firstName?.ar || comment?.user.firstName} ${comment?.user.lastName?.ar || comment?.user.lastName}`
                                                                  : `${comment?.user.firstName?.en || comment?.user.firstName} ${comment?.user.lastName?.en || comment?.user.lastName}`
                                                            : "N/A"}
                                                </Link>
                                                <p
                                                      className="text-gray-700 mt-1"
                                                      dir={isArabic ? "rtl" : "ltr"}
                                                >
                                                      {isArabic
                                                            ? comment?.content?.ar
                                                            : comment?.content?.en}
                                                </p>
                                          </div>

                                          {/* Comment Actions */}
                                          {user?._id === comment.user._id && (
                                                <div className="relative" ref={dropdownRef}>
                                                      <button
                                                            onClick={toggleDropdown}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                                      >
                                                            <EllipsisVertical size={20} />
                                                      </button>
                                                      {dropdownVisible && (
                                                            <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-lg shadow-lg w-32 z-10">
                                                                  <button
                                                                        onClick={() => {
                                                                              onEdit(comment);
                                                                              setDropdownVisible(false);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                                                  >
                                                                        {
                                                                              isArabic
                                                                                    ? "تعديل"
                                                                                    : "Edit"
                                                                        }
                                                                  </button>
                                                                  <button
                                                                        onClick={() =>
                                                                              onDelete(comment._id)
                                                                        }
                                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 text-sm"
                                                                  >
                                                                        {
                                                                              isArabic
                                                                                    ? "حذف"
                                                                                    : "Delete"
                                                                        }
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                          )}
                                    </div>

                                    {/* Interaction Bar */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                          <button
                                                onClick={() => onLike(comment._id)}
                                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                          >
                                                <Heart
                                                      fill={
                                                            (comment.likes || []).includes(user?._id)
                                                                  ? "currentColor"
                                                                  : "none"
                                                      }
                                                      size={18}
                                                />
                                                {comment.likes?.length > 0 && comment.likes.length}
                                          </button>

                                          <button
                                                onClick={() => setReplying(!replying)}
                                                className="hover:text-primary transition-colors"
                                          >
                                                Reply
                                          </button>

                                          <span className="text-xs">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                          </span>
                                    </div>

                                    {/* Reply Form */}
                                    {replying && (
                                          <form onSubmit={handleReplySubmit} className="pt-4">
                                                <div className="flex gap-3 items-start">
                                                      <div className="shrink-0 mt-1">
                                                            <UserAvatar user={user} size="xs" />
                                                      </div>
                                                      <div className="flex-1 relative">
                                                            <input
                                                                  dir={isArabic ? "rtl" : "ltr"}
                                                                  value={replyText}
                                                                  onChange={(e) =>
                                                                        setReplyText(e.target.value)
                                                                  }
                                                                  placeholder={
                                                                        isArabic
                                                                              ? "اكتب ردك هنا..."
                                                                              : "Write your reply here..."
                                                                  }
                                                                  className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-400 bg-gray-50"
                                                            />
                                                            <button
                                                                  type="submit"
                                                                  className="absolute right-3 top-3 text-primary hover:text-primary-dark"
                                                            >
                                                                  <Send size={18} />
                                                            </button>
                                                      </div>
                                                </div>
                                          </form>
                                    )}
                              </div>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies?.length > 0 && (
                              <div className="space-y-4 mt-4">
                                    {comment.replies.map((reply) => (
                                          <CommentItem
                                                key={reply._id}
                                                comment={reply}
                                                user={user}
                                                recipeId={recipeId}
                                                isAuthenticated={isAuthenticated}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onLike={onLike}
                                                onReply={onReply}
                                                depth={depth + 1}
                                          />
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
};

CommentItem.propTypes = {
      comment: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
      recipeId: PropTypes.string.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      onEdit: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      onLike: PropTypes.func.isRequired,
      onReply: PropTypes.func.isRequired,
      depth: PropTypes.number,
};

export default CommentItem;
