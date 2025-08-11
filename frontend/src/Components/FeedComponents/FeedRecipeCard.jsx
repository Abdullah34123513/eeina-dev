import { Heart, MessageSquare, Send, Share, Share2, UserCircle2 } from 'lucide-react';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { handleLike } from '../../Functions/LikeHandlerFunction';
import handleSaveRecipe from '../../Functions/contentSevedFunction';
import handlePostApi from '../../API/Handler/postApi.handler';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import ShareProfileModal from '../URLShareModal/URLShareModal';

const FeedRecipeCard = ({ recipe }) => {
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const [isCommentOpen, setIsCommentOpen] = useState(false);
      const [comment, setComment] = useState("");
      const [isOpen, setIsOpen] = useState(false);
      const { isArabic } = useLang();


      const [isLiked, setIsLiked] = useState(
            recipe.likedBy?.includes(user?._id) || false
      );
      const [likeCount, setLikeCount] = useState(recipe.likedBy?.length || 0);
      const [saved, setSaved] = useState(user?.savedRecipes?.includes(recipe?._id));

      // Update like state when user logs in/out or recipe.likedBy changes
      useEffect(() => {
            if (user && user._id) {
                  setIsLiked(recipe.likedBy?.includes(user._id) || false);
            } else {
                  setIsLiked(false);
            }
      }, [user, recipe.likedBy]);

      const dispatch = useDispatch();
      const navigate = useNavigate();

      const handleRecipeLike = async () => {
            await handleLike({
                  dataID: recipe?._id,
                  isAuthenticated,
                  isLiked,
                  setIsLiked,
                  likeCount,
                  setLikeCount,
                  collection: 'like',
            });
      };

      const saveRecipeToUser = async () => {
            await handleSaveRecipe({
                  setSaved,
                  saved,
                  dispatch,
                  navigate,
                  id: recipe?._id,
            });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!isAuthenticated) {
                  alert("Please login to comment.");
                  return;
            }
            try {
                  const res = await handlePostApi("comment/create", { content: comment, recipeId: recipe._id });
                  if (res.statusCode === 201) {
                        setComment("");
                        navigate(`/recipe/${recipe._id}`);
                  }
            } catch (error) {
                  console.error("Error creating comment:", error);
            }
      };


      return (
            <>
                  <div className="p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl bg-white duration-300">
                        <Link to={`/creators/${recipe?.createdBy?._id}`} className="flex items-center py-4 gap-3">
                              <div>
                                    {recipe?.createdBy?.image?.url ? (
                                          recipe?.createdBy?.image?.url === "default.webp" ? (
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                      {recipe?.createdBy?.firstName && recipe?.createdBy?.firstName[0]}
                                                </div>
                                          ) : (
                                                <img
                                                      src={recipe?.createdBy?.image?.url}
                                                      alt={recipe?.createdBy?.image?.key}
                                                      className="w-10 h-10 rounded-full object-cover"
                                                />
                                          )
                                    ) : (
                                          recipe?.metadata?.imported && (
                                                <Link
                                                      to={recipe?.metadata?.originalUrl}
                                                      className='text-base font-semibold text-black'
                                                      target='_blank'
                                                      rel='noreferrer'
                                                >
                                                      {recipe?.metadata?.site[0].toUpperCase() + recipe?.metadata?.site?.slice(1)}
                                                </Link>
                                          )
                                    )}
                              </div>
                              <div>
                                    <h1
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {
                                                isArabic ? recipe?.createdBy?.firstName?.ar : recipe?.createdBy?.firstName?.en
                                          }
                                    </h1>
                              </div>
                        </Link>
                        <Link to={`/recipe/${recipe._id}`}>
                              <img
                                    src={recipe?.thumbnail?.url}
                                    alt="Recipe Image"
                                    className="w-full rounded-xl"
                              />
                        </Link>
                        <div className="flex items-center justify-between py-4 px-1">
                              <div className="flex items-center gap-4">
                                    <button
                                          onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRecipeLike();
                                          }}
                                    >
                                          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-black'}`} />
                                    </button>
                                    <MessageSquare
                                          onClick={() => setIsCommentOpen(!isCommentOpen)}
                                          className="w-5 h-5 text-black cursor-pointer"
                                    />
                                    <Share2
                                          onClick={() => setIsOpen(true)}
                                          className="w-5 h-5 text-black cursor-pointer"
                                    />
                              </div>
                              <div>
                                    <button className="p-2" onClick={() => saveRecipeToUser()}>
                                          <Share
                                                className="w-5 h-5 text-black" />
                                    </button>
                              </div>
                        </div>
                        <div>
                              <Link to={`/recipe/${recipe._id}`} className="text-primary">
                                    <h1
                                          className="text-2xl font-oswald font-medium"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {
                                                isArabic ? recipe?.title?.ar : recipe?.title?.en
                                          }
                                    </h1>
                              </Link>
                              <div>
                                    <p
                                          className="text-sm font-oswald font-light"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {
                                                isArabic ? (
                                                      recipe?.description?.ar
                                                            .replace(/<\/?[^>]+(>|$)/g, "")
                                                            .split(" ")
                                                            .slice(0, 20)
                                                            .join(" ") + "..."
                                                ) : (
                                                      recipe?.description?.en
                                                            .replace(/<\/?[^>]+(>|$)/g, "")
                                                            .split(" ")
                                                            .slice(0, 20)
                                                            .join(" ") + "..."
                                                )
                                          }
                                    </p>
                              </div>
                        </div>
                        <div
                              className="flex items-center gap-4 py-4 text-sm text-gray-600"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(() => {
                                    const createdDate = new Date(recipe?.createdAt);
                                    const diffTime = Date.now() - createdDate.getTime();
                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                    if (diffDays < 1) {
                                          return (
                                                <p dir={isArabic ? "rtl" : "ltr"}>
                                                      {isArabic ? "اليوم" : "Today"}
                                                </p>
                                          );
                                    }

                                    if (isArabic) {
                                          return (
                                                <p dir="rtl">
                                                      منذ {diffDays} {diffDays === 1 ? "يوم" : diffDays === 2 ? "يومين" : diffDays <= 10 ? `${diffDays} أيام` : "يوماً"}
                                                </p>
                                          );
                                    }

                                    return (
                                          <p>
                                                {diffDays} day{diffDays > 1 ? "s" : ""} ago
                                          </p>
                                    );
                              })()}
                        </div>

                        <AnimatePresence>
                              {isCommentOpen && (
                                    <motion.form
                                          onSubmit={handleSubmit}
                                          className="flex items-center gap-2 duration-300"
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          transition={{ duration: 0.1 }}
                                    >
                                          <Link to={`/user/profile`}>
                                                {user?.image?.url ? (
                                                      user.image.url === "default.webp" ? (
                                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                                  {user?.firstName?.en?.charAt(0)}
                                                            </div>
                                                      ) : (
                                                            <img
                                                                  src={user.image.url}
                                                                  alt="Author Image"
                                                                  className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                      )
                                                ) : (
                                                      <UserCircle2 size={36} className="text-gray-500" />
                                                )}
                                          </Link>
                                          <div className="relative w-full">
                                                <input
                                                      type="text"
                                                      name="comment"
                                                      id="comment"
                                                      autoComplete="off"
                                                      placeholder="Add a comment"
                                                      value={comment}
                                                      onChange={(e) => setComment(e.target.value)}
                                                      className="w-full p-2 pr-10 bg-gray-100 rounded-full focus:outline-none"
                                                />
                                                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                      <Send size={24} className="text-blue-500 hover:text-blue-600" />
                                                </button>
                                          </div>
                                    </motion.form>
                              )}
                        </AnimatePresence>
                  </div>
                  <ShareProfileModal isOpen={isOpen} setIsOpen={setIsOpen} URL={`https://crap.ninja/en/recipe/${recipe?._id}`} />

            </>
      );
};

FeedRecipeCard.propTypes = {
      recipe: propTypes.object.isRequired,
};

export default FeedRecipeCard;
