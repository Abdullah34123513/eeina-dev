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
                        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                              {/* Image container */}
                              <div className="relative h-52 w-full overflow-hidden">
                                    <img
                                          src={recipe?.thumbnail?.url}
                                          alt="Recipe"
                                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Primary color overlay */}
                                    <div className="absolute inset-0 bg-[#018558]/10 group-hover:bg-[#018558]/15 transition-colors duration-300" />

                                    {/* Play Icon */}
                                    {recipe?.videoUrl && (
                                          <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <CirclePlay
                                                      size={50}
                                                      className="text-white/90 drop-shadow-lg group-hover:text-white group-hover:scale-110 transition-all duration-300"
                                                />
                                          </div>
                                    )}

                                    {/* Top-right Icons */}
                                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                                          <button
                                                onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      handleRecipeLike();
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors duration-200"
                                          >
                                                <Heart
                                                      className={`w-5 h-5 ${isLiked ? "text-red-500" : "text-[#018558]"}`}
                                                      fill={
                                                            isLiked
                                                                  ? "currentColor"
                                                                  : "none"
                                                      }

                                                />
                                          </button>

                                          <button
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors duration-200"
                                                onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      saveRecipeToUser();
                                                }}
                                          >
                                                <Share className="w-5 h-5 text-[#018558]" />
                                          </button>
                                    </div>

                                    {/* Time Badge */}
                                    <div
                                          className="absolute z-50 bottom-3 right-3 px-3 py-1.5 bg-[#018558] text-white rounded-full text-sm font-medium shadow-md"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          ⏳ {recipe?.time} {isArabic ? "مين" : "Min"}
                                    </div>

                                    {/* Bottom Author Section */}
                                    <div className="absolute bottom-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-gradient-to-t from-[#018558]/90 to-transparent">
                                          <div className="flex items-center gap-3">
                                                {createdBy?.image?.url ? (
                                                      createdBy.image.url === "default.webp" ? (
                                                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#018558] font-bold uppercase border-2 border-white">
                                                                  {createdBy?.firstName?.[0]}
                                                            </div>
                                                      ) : (
                                                            <img
                                                                  src={createdBy.image.url}
                                                                  alt={createdBy.image.key}
                                                                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                                                            />
                                                      )
                                                ) : recipe?.metadata?.imported ? (
                                                      <Link
                                                            to={recipe.metadata.originalUrl}
                                                            className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-[#018558] hover:bg-white transition-colors"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                      >
                                                            {recipe.metadata.site[0].toUpperCase() +
                                                                  recipe.metadata.site?.slice(1)}
                                                      </Link>
                                                ) : null}

                                                {!recipe?.metadata?.imported && (
                                                      <div className="text-white">
                                                            <p
                                                                  className="text-sm font-medium leading-tight"
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


                                                            <p className="text-xs opacity-90">
                                                                  Recipe Creator
                                                            </p>
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </div>

                              {/* Title Section */}
                              <div className="p-4 bg-gradient-to-b from-white to-[#018558]/5">
                                    <h3 className="font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#018558] transition-colors mb-2" dir={isArabic ? "rtl" : "ltr"}>
                                          {
                                                isArabic ? recipe?.title?.ar : recipe?.title?.en
                                          }
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-[#018558]">
                                          <span
                                                className="bg-[#018558]/10 px-2 py-1 rounded-md"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                🥄 {recipe?.servings} {isArabic ? "الحصص" : "Servings"}
                                          </span>
                                          <span className="text-gray-400">•</span>
                                          <span
                                                className="bg-[#018558]/10 px-2 py-1 rounded-md"
                                                dir={isArabic ? "rtl" : "ltr"}
                                          >
                                                🍴 {recipe?.ingredients?.length} {isArabic ? "المكونات" : "ingredients"}
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
