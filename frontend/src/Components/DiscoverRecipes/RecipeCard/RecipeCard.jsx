import { CirclePlay, Heart, Share } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShareProfileModal from '../../URLShareModal/URLShareModal';
import { useDispatch, useSelector } from 'react-redux';
import { handleLike } from '../../../Functions/LikeHandlerFunction';
import handleSaveRecipe from '../../../Functions/contentSevedFunction';
import { useLang } from '../../../context/LangContext';

const RecipeCard = ({ recipe }) => {
      const { user, isAuthenticated } = useSelector((state) => state.user);
      const { createdBy } = recipe || {};
      const [isOpen, setIsOpen] = useState(false);
      const [saved, setSaved] = useState(user?.savedRecipes?.includes(recipe?._id));
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { isArabic } = useLang();




      // Set up local state for like functionality.
      // Check if the current user is in the likedBy array.
      const [isLiked, setIsLiked] = useState(
            recipe.likedBy?.includes(user?._id) || false
      );
      const [likeCount, setLikeCount] = useState(recipe.likedBy?.length || 0);



      // Effect to update the like state when the user logs in/out or recipe.likedBy changes
      useEffect(() => {
            if (user && user._id) {
                  setIsLiked(recipe.likedBy?.includes(user._id) || false);
            } else {
                  // If no user is logged in, ensure isLiked is false
                  setIsLiked(false);
            }
      }, [user, recipe.likedBy]);

      const handleRecipeLike = async () => {
            await handleLike({
                  dataID: recipe?._id,
                  isAuthenticated,
                  isLiked,
                  setIsLiked,
                  likeCount,
                  setLikeCount,
                  collection: 'like',
            })
      }


      const saveRecipeToUser = async () => {
            await handleSaveRecipe({
                  setSaved,
                  saved,
                  dispatch,
                  navigate,
                  id: recipe?._id,
            })
      }

      return (
            <>
                  <Link to={`/recipe/${recipe._id}`} className="group block">
                        <div className="relative card card-hover overflow-hidden group-hover:shadow-glow group-hover:border-primary-200">
                              {/* Image container */}
                              <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                          src={recipe?.thumbnail?.url}
                                          alt="Recipe"
                                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Enhanced overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all duration-300" />

                                    {/* Play Icon */}
                                    {recipe?.videoUrl && (
                                          <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <CirclePlay
                                                      size={60}
                                                      className="text-white drop-shadow-2xl group-hover:scale-125 transition-all duration-300 animate-pulse-slow"
                                                />
                                          </div>
                                    )}

                                    {/* Top-right Icons */}
                                    <div className="absolute top-4 right-4 flex gap-3 z-20">
                                          <button
                                                onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      handleRecipeLike();
                                                }}
                                                className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft hover:bg-white hover:scale-110 transition-all duration-300"
                                          >
                                                <Heart
                                                      className={`w-5 h-5 ${isLiked ? "text-error" : "text-primary-600"}`}
                                                      fill={
                                                            isLiked
                                                                  ? "currentColor"
                                                                  : "none"
                                                      }

                                                />
                                          </button>

                                          <button
                                                className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft hover:bg-white hover:scale-110 transition-all duration-300"
                                                onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      saveRecipeToUser();
                                                }}
                                          >
                                                <Share className="w-5 h-5 text-primary-600" />
                                          </button>
                                    </div>

                                    {/* Time Badge */}
                                    <div
                                          className="absolute z-30 bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-2xl text-sm font-bold shadow-soft backdrop-blur-sm"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{recipe?.time} {isArabic ? "د" : "min"}</span>
                                          </div>
                                    </div>

                                    {/* Bottom Author Section */}
                                    <div className="absolute bottom-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/80 to-transparent">
                                          <div className="flex items-center gap-4">
                                                {createdBy?.image?.url ? (
                                                      createdBy.image.url === "default.webp" ? (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold uppercase border-2 border-white shadow-soft">
                                                                  <span className="font-display">{createdBy?.firstName?.[0]}</span>
                                                            </div>
                                                      ) : (
                                                            <img
                                                                  src={createdBy.image.url}
                                                                  alt={createdBy.image.key}
                                                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-soft"
                                                            />
                                                      )
                                                ) : recipe?.metadata?.imported ? (
                                                      <Link
                                                            to={recipe.metadata.originalUrl}
                                                            className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-sm font-semibold text-primary-600 hover:bg-white transition-all duration-200 shadow-soft"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                      >
                                                            {recipe.metadata.site[0].toUpperCase() +
                                                                  recipe.metadata.site?.slice(1)}
                                                      </Link>
                                                ) : null}

                                                {!recipe?.metadata?.imported && (
                                                      <div className="text-white drop-shadow-lg">
                                                            <p
                                                                  className="text-sm font-semibold leading-tight"
                                                                  dir={isArabic ? "rtl" : "ltr"}
                                                            >
                                                                  {createdBy?.firstName
                                                                        ? isArabic
                                                                              ? createdBy.firstName?.ar
                                                                              : createdBy.firstName?.en
                                                                        : ""}
                                                                  {" "}
                                                                  {createdBy?.lastName
                                                                        ? isArabic
                                                                              ? createdBy.lastName?.ar
                                                                              : createdBy.lastName?.en
                                                                        : ""}
                                                            </p>

                                                            <p className="text-xs opacity-80 font-medium">
                                                                  {isArabic ? "منشئ الوصفة" : "Recipe Creator"}
                                                            </p>
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </div>

                              {/* Title Section */}
                              <div className="p-6 bg-gradient-to-b from-white to-primary-50/30">
                                    <h3 className="font-bold text-lg text-neutral-800 group-hover:text-primary-600 transition-colors mb-3 line-clamp-2" dir={isArabic ? "rtl" : "ltr"}>
                                          {
                                                isArabic ? recipe?.title?.ar : recipe?.title?.en
                                          }
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm">
                                          <span
                                                className="bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>{recipe?.servings} {isArabic ? "حصص" : "servings"}</span>
                                          </span>
                                          <span className="text-neutral-300">•</span>
                                          <span
                                                className="bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <span>{recipe?.ingredients?.length} {isArabic ? "مكونات" : "ingredients"}</span>
                                          </span>
                                    </div>
                              </div>
                        </div>
                  </Link>

                  <ShareProfileModal isOpen={isOpen} setIsOpen={setIsOpen} />
            </>
      );
};

RecipeCard.propTypes = {
      recipe: PropTypes.shape({
            id: PropTypes.string,
            _id: PropTypes.string,
            time: PropTypes.number,
            thumbnail: PropTypes.shape({
                  url: PropTypes.string,
            }),
            title: PropTypes.string,
            sourceUrl: PropTypes.string,
            sourceName: PropTypes.string,
            source: PropTypes.string,
            extendedIngredients: PropTypes.arrayOf(PropTypes.object),
            likedBy: PropTypes.array, // list of user IDs who liked the recipe
            videoUrl: PropTypes.string, // URL of the recipe video
            metadata: PropTypes.shape({
                  imported: PropTypes.bool,
                  site: PropTypes.string,
                  originalUrl: PropTypes.string,
            }),
            servings: PropTypes.number,
            ingredients: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
      videoUrl: PropTypes.bool,
};

export default RecipeCard;
