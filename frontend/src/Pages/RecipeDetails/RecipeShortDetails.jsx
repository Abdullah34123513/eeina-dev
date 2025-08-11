import {
      Check,
      Pencil,
      Plus,
      Printer,
      Save,
      SaveOff,
      Send,
      /* Star, */ Trash,
      Play,
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import handlePostApi from "../../API/Handler/postApi.handler";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import CircularProgress from "./CircularProgress";
import handleDeleteApi from "../../API/Handler/deleteApi.handler";
import { apiClient } from "../../Constant/api.constant";
import handleSaveRecipe from "../../Functions/contentSevedFunction";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TikTokPlayer from "../../Components/Player/TiktokPlayer";
import { useLang } from "../../context/LangContext";

// Utility function to get YouTube video thumbnail from the embed URL.
const getYoutubeThumbnail = (url) => {
      let videoId = null;

      // Match various YouTube URL formats
      const patterns = [
            /(?:youtube\.com\/(?:embed|watch)\?v=|youtube\.com\/embed\/|youtu\.be\/)([^?&/]+)/,
            /youtube\.com\/watch\?.*v=([^&]+)/,
            /youtube\.com\/embed\/([^?]+)/,
      ];

      for (const pattern of patterns) {
            const match = url?.match(pattern);
            if (match && match[1]) {
                  videoId = match[1];
                  break;
            }
      }

      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};


// Utility function to detect TikTok URLs
const isTikTokUrl = (url) => {
      return url?.includes("tiktok.com");
};

// Utility function to extract TikTok video ID
// eslint-disable-next-line no-unused-vars
const getTikTokVideoId = (url) => {
      const regex = /\/video\/(\d+)/;
      const match = url?.match(regex);
      return match ? match[1] : null;
};

const getTikTokThumbnail = async (url) => {
      try {
            const embedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
            const response = await fetch(embedUrl);
            const data = await response.json();

            if (data?.thumbnail_url) {
                  return data.thumbnail_url; // Return the thumbnail URL
            }
      } catch (error) {
            console.error("Error fetching TikTok thumbnail:", error);
      }

      return null;
};

const RecipeShortDetails = ({
      id,
      title,
      thumbnail,
      otherImages,
      videoUrl,
      ingredients,
      cookTime,
      nutrition,
      setIsOpen,
      createdBy,
      user,
      isAuthenticated,
      recipe,
      setShowModal,
      description
}) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      // Initialize local state with the recipe author passed in the props.
      const [recipeAuthor, setRecipeAuthor] = useState(createdBy);

      const [tiktokThumbnail, setTiktokThumbnail] = useState(null);

      // Local state to trigger celebration animation for following
      const [celebrate, setCelebrate] = useState(false);
      // Local state to track saved status for immediate UI update
      const [saved, setSaved] = useState(user?.savedRecipes?.includes(id));
      const [loading, setLoading] = useState(false);

      const { isArabic } = useLang();

      // When the createdBy prop changes, update local recipeAuthor state.
      useEffect(() => {
            setRecipeAuthor(createdBy);
            videoUrl &&
                  isTikTokUrl(videoUrl) &&
                  getTikTokThumbnail(videoUrl).then(setTiktokThumbnail);
      }, [createdBy, videoUrl]);

      // Destructure properties from the local recipeAuthor state
      const { _id, follower } = recipeAuthor || {};

      const handleFollowToggle = async () => {
            if (!isAuthenticated) {
                  return;
            }

            // Check if the logged-in user is already following the recipe author
            const isAlreadyFollowing = follower?.includes(user?._id.toString());

            if (isAlreadyFollowing) {
                  // Show confirmation popup
                  const confirmed = window.confirm("Are you sure you want to unfollow this user?");
                  if (!confirmed) return;

                  // Unfollow user
                  const res = await handlePostApi(`follow/${_id}/unfollow`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // Remove the user's ID from the local follower list
                        setRecipeAuthor((prev) => ({
                              ...prev,
                              follower: prev.follower.filter((id) => id !== user._id.toString()),
                        }));
                  }
            } else {
                  // Follow user
                  const res = await handlePostApi(`follow/${_id}`, {});
                  if (res?.statusCode === 200 || res?.statusCode === 201) {
                        // Update the local follower list immediately
                        setRecipeAuthor((prev) => ({
                              ...prev,
                              follower: prev?.follower
                                    ? [...prev.follower, user._id.toString()]
                                    : [user._id.toString()],
                        }));
                        // Trigger celebration animation
                        setCelebrate(true);
                        setTimeout(() => setCelebrate(false), 2000);
                  }
            }
            console.log("Response data:", isAlreadyFollowing ? "Unfollowed" : "Followed");
      };

      const saveRecipeToUser = async () => {
            await handleSaveRecipe({
                  setSaved,
                  saved,
                  dispatch,
                  navigate,
                  id,
            });
      };

      const handlePDF = async () => {
            try {
                  setLoading(true);
                  const response = await apiClient.post(
                        `/recipe/pdf`,
                        {
                              recipe,
                              recipeLang: isArabic ? "ar" : "en",
                        },
                        {
                              responseType: "blob", // or "arraybuffer"
                        }
                  );

                  const disposition = response.headers["content-disposition"] || "";
                  const filename = disposition.match(/filename="?(.+?)"?$/)?.[1] || "recipe.pdf";

                  setLoading(false);

                  const blob = new Blob([response.data], { type: "application/pdf" });
                  const url = URL.createObjectURL(blob);

                  const a = document.createElement("a");
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
            } catch (error) {
                  setLoading(false);
                  console.error("PDF download failed:", error);
            }
      };

      const userGoals = {
            Calories: user?.calorieGoal || 2000,
            Carbohydrates: user?.carbGoal || 225,
            Fat: user?.fatGoal || 66.66,
            Protein: user?.proteinGoal || 125,
            Sugar: user?.sugarGoal || 50,
      };

      const handleDeleteRecipe = async (recipeId) => {
            if (!isAuthenticated) {
                  alert("Please login to delete recipe");
                  return;
            }

            const confirmed = window.confirm("Are you sure you want to delete this recipe?");
            if (!confirmed) return;

            const res = await handleDeleteApi(`recipe/delete`, recipeId);

            if (res?.statusCode === 200 || res?.statusCode === 201) {
                  toast.success("Recipe deleted successfully");
                  navigate("/explore");
            }
      };

      // Build the slider items array:
      // If videoUrl exists, insert a video item as the second element.
      // When creating sliderItems, include TikTok URLs directly
      const sliderItems = videoUrl
            ? [
                  thumbnail,
                  { video: true, url: videoUrl }, // videoUrl could be TikTok or YouTube
                  ...otherImages,
            ]
            : [thumbnail, ...otherImages];

      const [currentIndex, setCurrentIndex] = useState(0);

      const handleThumbnailClick = (index) => {
            setCurrentIndex(index);
      };

      const getYoutubeID = (url) => {
            const regex =
                  // eslint-disable-next-line no-useless-escape
                  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url?.match(regex);
            return match ? match[1] : null;
      };

      console.log("Extracted Video ID:", getYoutubeID(sliderItems[currentIndex]?.url));

      return (
            <>
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        {/* Recipe Image / Video Slider */}
                        <div className="w-full lg:w-1/2">
                              {/* Main preview */}
                              <div className="mb-4">
                                    {sliderItems[currentIndex]?.video ? (
                                          isTikTokUrl(sliderItems[currentIndex]?.url) ? (
                                                // TikTok Embed
                                                <TikTokPlayer
                                                      url={sliderItems[currentIndex]?.url}
                                                      className="w-full aspect-square rounded-lg"
                                                />
                                          ) : (
                                                // YouTube Embed
                                                <iframe
                                                      key="youtube-video"
                                                      src={`https://www.youtube.com/embed/${getYoutubeID(sliderItems[currentIndex].url)}?rel=0&modestbranding=1&playsinline=1`}
                                                      title="Recipe Video"
                                                      frameBorder="0"
                                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                      className="w-full aspect-square rounded-lg"
                                                />
                                          )
                                    ) : (
                                          // Image fallback
                                          <img
                                                key={sliderItems[currentIndex]?.url}
                                                src={sliderItems[currentIndex]?.url}
                                                alt={title}
                                                className="w-full aspect-square object-cover rounded-lg"
                                          />
                                    )}
                              </div>
                              {/* Thumbnails */}
                              <Swiper
                                    spaceBetween={10}
                                    slidesPerView="4.5"
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    className="mySwiper"
                                    style={{ paddingBottom: "10px" }}
                              >
                                    {sliderItems.map((item, index) => (
                                          <SwiperSlide
                                                key={index}
                                                className="relative w-24 aspect-square"
                                          >
                                                {item?.video ? (
                                                      <div
                                                            onClick={() =>
                                                                  handleThumbnailClick(index)
                                                            }
                                                            className={`relative w-full aspect-square rounded-lg cursor-pointer ${index === currentIndex ? "border-2 border-primary" : ""}`}
                                                      >
                                                            <img
                                                                  src={
                                                                        isTikTokUrl(item?.url)
                                                                              ? tiktokThumbnail
                                                                              : getYoutubeThumbnail(
                                                                                    item?.url
                                                                              )
                                                                  }
                                                                  alt="Video Thumbnail"
                                                                  className="w-24 aspect-square object-cover rounded-lg"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                  <Play
                                                                        size={24}
                                                                        className="text-white"
                                                                  />
                                                            </div>
                                                      </div>
                                                ) : (
                                                      <img
                                                            src={item?.url}
                                                            alt={item?.title}
                                                            onClick={() =>
                                                                  handleThumbnailClick(index)
                                                            }
                                                            className={`w-24 aspect-square object-cover rounded-lg cursor-pointer ${index === currentIndex ? "border-2 border-primary" : ""}`}
                                                      />
                                                )}
                                          </SwiperSlide>
                                    ))}
                              </Swiper>
                        </div>
                        <div className="flex-1">
                              {/* Recipe Rating */}
                              <div className="flex justify-end items-center mt-2">
                                    {/* <div className='flex items-center space-x-1'>
                                          {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} size={20} color="#FF9D23" />
                                          ))}
                                    </div> */}
                                    <div className="flex items-end space-x-2">
                                          {
                                                loading ?
                                                      <div className="flex justify-center items-center">
                                                            <div className="w-5 h-5 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
                                                      </div> :

                                                      <Printer onClick={handlePDF} className="cursor-pointer" />
                                          }
                                          {isAuthenticated && _id === user?._id && (
                                                <Trash
                                                      onClick={() => handleDeleteRecipe(id)}
                                                      className="text-danger cursor-pointer"
                                                />
                                          )}
                                    </div>
                              </div>

                              {/* Author */}
                              <div className="flex items-center mt-6 justify-between">
                                    <div className="flex items-center mt-6 justify-between">
                                          {createdBy ? (
                                                <Link
                                                      to={`/creators/${_id}`}
                                                      className="flex items-center justify-center mt-3 space-x-4"
                                                >
                                                      {createdBy?.image?.url === "default.webp" ? (
                                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary text-2xl font-bold uppercase">
                                                                  {createdBy?.firstName?.[0]}
                                                            </div>
                                                      ) : (
                                                            <img
                                                                  src={createdBy?.image?.url}
                                                                  alt={createdBy?.image?.key}
                                                                  className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                      )}

                                                      <div
                                                            className="flex flex-col justify-start space-y-0"
                                                            dir={isArabic ? "rtl" : "ltr"}
                                                      >
                                                            {!recipe?.metadata?.imported && (
                                                                  <>
                                                                        <span className="text-base font-semibold text-black">
                                                                              {createdBy?.firstName &&
                                                                                    createdBy?.lastName
                                                                                    ? isArabic
                                                                                          ? `${createdBy.firstName?.ar || createdBy.firstName} ${createdBy.lastName?.ar || createdBy.lastName}`
                                                                                          : `${createdBy.firstName?.en || createdBy.firstName} ${createdBy.lastName?.en || createdBy.lastName}`
                                                                                    : "N/A"}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">
                                                                              {follower?.length ||
                                                                                    0}{" "}
                                                                              {follower?.length > 1
                                                                                    ? isArabic ?
                                                                                          "متابعون"
                                                                                          : "Followers"
                                                                                    : isArabic ?
                                                                                          "متابع"
                                                                                          : "Follower"}
                                                                        </span>
                                                                  </>
                                                            )}
                                                      </div>
                                                </Link>
                                          ) : (
                                                <div className="flex items-center justify-center mt-3 space-x-4">
                                                      {recipe?.metadata?.imported && (
                                                            <Link
                                                                  to={recipe?.metadata?.originalUrl}
                                                                  className="text-base font-semibold text-black"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                            >
                                                                  {recipe?.metadata?.site?.[0].toUpperCase() +
                                                                        recipe?.metadata?.site?.slice(
                                                                              1
                                                                        )}
                                                            </Link>
                                                      )}
                                                </div>
                                          )}
                                    </div>

                                    <div>
                                          {isAuthenticated && createdBy && (
                                                <motion.button
                                                      whileTap={{
                                                            scale: celebrate ? 1.4 : 1,
                                                      }}
                                                      transition={{
                                                            type: "spring",
                                                            stiffness: 300,
                                                            damping: 20,
                                                      }}
                                                      className="flex items-center gap-2 text-primary hover:text-white hover:bg-primary duration-300 border rounded-md px-2 py-1 me-5"
                                                      onClick={handleFollowToggle}
                                                >
                                                      {follower?.includes(user?._id.toString()) ? (
                                                            <>
                                                                  <Check size={16} />
                                                                  {
                                                                        isArabic ?
                                                                              "إلغاء المتابعة" :
                                                                              "Unfollow"
                                                                  }
                                                            </>
                                                      ) : (
                                                            <>
                                                                  <Plus size={16} />
                                                                  {
                                                                        isArabic ?
                                                                              "متابعة" :
                                                                              "Follow"
                                                                  }
                                                            </>
                                                      )}
                                                </motion.button>
                                          )}
                                    </div>
                              </div>

                              {/* Recipe Details */}
                              <div className="flex flex-col items-center justify-center mt-5 space-y-5">
                                    <h1
                                          className="text-4xl font-normal mt-6 text-center"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {isArabic ? title?.ar : title?.en}
                                    </h1>
                                    <div className="flex flex-col items-center space-y-2">
                                          <p>
                                                {
                                                      isArabic
                                                            ? description?.ar ||
                                                            "لا يوجد وصف"
                                                            : description?.en ||
                                                            "No description available"
                                                }
                                          </p>
                                          <div>
                                                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                      {nutrition?.nutrients.map(
                                                            (nutrient, index) => {
                                                                  if (userGoals[nutrient.name]) {
                                                                        return (
                                                                              <CircularProgress
                                                                                    key={index}
                                                                                    valueString={
                                                                                          nutrient.amount
                                                                                    }
                                                                                    label={
                                                                                          nutrient.name
                                                                                    }
                                                                                    size={80}
                                                                                    duration={2}
                                                                                    dailyNeed={
                                                                                          userGoals[
                                                                                          nutrient
                                                                                                .name
                                                                                          ]
                                                                                    }
                                                                              />
                                                                        );
                                                                  } else if (
                                                                        [
                                                                              "Calories",
                                                                              "Carbohydrates",
                                                                              "Fat",
                                                                              "Protein",
                                                                              "Sugar",
                                                                        ].includes(
                                                                              nutrient.name?.en
                                                                        )
                                                                  ) {
                                                                        return (
                                                                              <CircularProgress
                                                                                    key={index}
                                                                                    valueString={
                                                                                          nutrient.amount
                                                                                    }
                                                                                    label={
                                                                                          nutrient
                                                                                                .name
                                                                                                ?.en
                                                                                    }
                                                                                    size={80}
                                                                                    duration={2}
                                                                                    dailyNeed={
                                                                                          userGoals[
                                                                                          nutrient
                                                                                                .name
                                                                                                ?.en
                                                                                          ]
                                                                                    }
                                                                              />
                                                                        );
                                                                  }
                                                                  return null;
                                                            }
                                                      )}
                                                </div>
                                                <div className="flex justify-end items-center gap-2 mt-2">
                                                      <span className="text-gray-500 text-xs">
                                                            *
                                                            {isArabic
                                                                  ? user?.calorieGoal
                                                                        ? `بناءً على هدفك اليومي البالغ ${user?.calorieGoal} سعرة حرارية`
                                                                        : "بناءً على هدفك اليومي البالغ 2000 سعرة حرارية"
                                                                  : user?.calorieGoal
                                                                        ? `Based on your daily goal of ${user?.calorieGoal} calories`
                                                                        : "Based on your daily goal of 2000 calories"}
                                                      </span>

                                                </div>
                                          </div>
                                    </div>
                              </div>

                              {/* Icons Section */}
                              <div className="flex justify-center items-center gap-12 mt-10">
                                    <motion.div
                                          whileTap={{ scale: 1.2 }}
                                          transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                          }}
                                          className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
                                          onClick={saveRecipeToUser}
                                    >
                                          {saved ? (
                                                <>
                                                      <SaveOff size={28} />
                                                      <span>
                                                            {
                                                                  isArabic
                                                                        ? "تم الحفظ"
                                                                        : "Saved"
                                                            }
                                                      </span>
                                                </>
                                          ) : (
                                                <>
                                                      <Save size={28} />
                                                      <span>
                                                            {
                                                                  isArabic
                                                                        ? "احفظ الوصفة"
                                                                        : "Save Recipe"
                                                            }
                                                      </span>
                                                </>
                                          )}
                                    </motion.div>
                                    {/* <div className="flex flex-col items-center justify-center space-y-1 cursor-pointer">
                                          <Plus size={28} />
                                          <span>Add to</span>
                                    </div> */}
                                    <div
                                          className="flex flex-col items-center justify-center space-y-1 cursor-pointer"
                                          onClick={() => setIsOpen(true)}
                                    >
                                          <Send size={28} />
                                          <span>
                                                {isArabic ? "مشاركة" : "Share"}
                                          </span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-1 cursor-pointer">
                                          <Link to={`/recipe/edit/${id}`}>
                                                <Pencil size={28} />
                                                <span>
                                                      {isArabic ? "تعديل" : "Edit"}
                                                </span>
                                          </Link>
                                    </div>
                              </div>

                              {/* Recipe Short Details */}
                              <div className="flex justify-between items-center my-8 text-lg">
                                    <div>
                                          <p>
                                                <strong className="text-gray-400">
                                                      {isArabic
                                                            ? "عدد المكونات"
                                                            : "Ingredients"}
                                                      :{" "}
                                                </strong>
                                                {ingredients?.length || "N/A"}
                                          </p>
                                    </div>
                                    <div>
                                          <p>
                                                <strong className="text-gray-400">
                                                      {
                                                            isArabic
                                                                  ? "وقت التحضير"
                                                                  : "Cook Time"
                                                      }
                                                      :{" "}
                                                </strong>
                                                {cookTime || "N/A"} {
                                                      isArabic ? "دقائق" : "minutes"
                                                }
                                          </p>
                                    </div>
                              </div>

                              {/* Add to plan btn */}
                              <div className="w-full">
                                    <button
                                          className="w-full bg-btnSecondary text-white font-medium px-4 py-3 rounded-md"
                                          onClick={() => setShowModal(true)}
                                    >
                                          {
                                                isArabic ?
                                                      "إظهار التغذية الكاملة"
                                                      : "Show Full Nutrition"
                                          }
                                    </button>
                              </div>
                        </div>
                  </div>
            </>
      );
};

RecipeShortDetails.propTypes = {
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.object,
      otherImages: PropTypes.array,
      videoUrl: PropTypes.string,
      ingredients: PropTypes.array,
      cookTime: PropTypes.string,
      nutrition: PropTypes.object,
      setIsOpen: PropTypes.func.isRequired,
      createdBy: PropTypes.string,
      user: PropTypes.object,
      isAuthenticated: PropTypes.bool,
      recipe: PropTypes.object,
      setShowModal: PropTypes.func.isRequired,
      description: PropTypes.string
};

export default RecipeShortDetails;
