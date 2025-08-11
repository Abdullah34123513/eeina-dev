import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import handleGetApi from "../../API/Handler/getApi.handler";
import { toast } from "react-hot-toast";
import DraggableRecipe from "./DraggableRecipe";
import propTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "../../context/LangContext";

const RecipeSlider = ({ initialRecipes = [] }) => {
      const [recipes, setRecipes] = useState(initialRecipes);
      const [page, setPage] = useState(1);
      const [hasMore, setHasMore] = useState(true);
      const [recipeDataCollectionTab, setRecipeDataCollectionTab] = useState(0);
      const [loading, setLoading] = useState(false);
      const [slidesPerView, setSlidesPerView] = useState(6);
      const prevRef = useRef(null);
      const nextRef = useRef(null);
      const { isArabic } = useLang();

      // Adjust slidesPerView based on window width
      useEffect(() => {
            const handleResize = () => {
                  setSlidesPerView(window.innerWidth < 768 ? 3 : 6);
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      const loadRecipes = async () => {
            try {
                  const res = await handleGetApi(`recipe?page=${page}&limit=15`);
                  const data = res.data;
                  if (data?.length > 0) {
                        setRecipes((prev) => [...prev, ...data]);
                        setPage((prev) => prev + 1);
                  } else {
                        setHasMore(false);
                  }
            } catch (error) {
                  console.error("Error loading recipes:", error);
                  toast.error(isArabic ? "حدث خطأ أثناء تحميل الوصفات" : "Error loading recipes");
            }
      };

      const loadSavedRecipes = async () => {
            try {
                  const res = await handleGetApi("recipe-user");
                  setRecipes(res.data || []);
            } catch (error) {
                  console.error("Error loading saved recipes:", error);
                  toast.error(isArabic ? "حدث خطأ أثناء تحميل الوصفات المحفوظة" : "Error loading saved recipes");
            }
      };

      const loadTrendingRecipes = async () => {
            try {
                  const res = await handleGetApi("recipe/popular");
                  setRecipes(res.data || []);
            } catch (error) {
                  console.error("Error loading trending recipes:", error);
                  toast.error(isArabic ? "حدث خطأ أثناء تحميل الوصفات الشائعة" : "Error loading trending recipes");
            }
      };

      // Tab Change Effect
      useEffect(() => {
            const fetchData = async () => {
                  setLoading(true);
                  setRecipes([]);
                  setPage(1);
                  setHasMore(true);

                  if (recipeDataCollectionTab === 0) {
                        await loadRecipes();
                  } else if (recipeDataCollectionTab === 1) {
                        await loadSavedRecipes();
                  } else if (recipeDataCollectionTab === 2) {
                        await loadTrendingRecipes();
                  }

                  setLoading(false);
            };

            fetchData();
      }, [recipeDataCollectionTab]);

      return (
            <div>
                  <div className="flex items-center mb-4 gap-3 lg:gap-6">
                        {[
                              isArabic ? "الوصفات غير المجدولة" : "Unscheduled Recipes",
                              isArabic ? "الوصفات المحفوظة" : "Saved Recipes",
                              isArabic ? "الوصفات الشائعة" : "Trending Recipes",
                        ].map((title, _i) => (
                              <button
                                    key={_i}
                                    className={`border-primary text-black font-normal text-xs text-nowrap lg:text-base px-2 lg:px-4 py-2 rounded-md transition-colors ${recipeDataCollectionTab === _i ? "border-[3px]" : "border"}`}
                                    onClick={() => setRecipeDataCollectionTab(_i)}
                              >
                                    {title}
                              </button>
                        ))}
                  </div>

                  {loading ? (
                        <p>{isArabic ? "جار التحميل..." : "Loading..."}</p>
                  ) : (
                        <div className="relative">
                              <Swiper
                                    modules={[Navigation]}
                                    spaceBetween={10}
                                    slidesPerView={slidesPerView}
                                    navigation={{
                                          prevEl: prevRef.current,
                                          nextEl: nextRef.current,
                                    }}
                                    onBeforeInit={(swiper) => {
                                          swiper.params.navigation.prevEl = prevRef.current;
                                          swiper.params.navigation.nextEl = nextRef.current;
                                    }}
                                    freeMode={true}
                                    allowTouchMove={false}
                                    onReachEnd={() => {
                                          if (hasMore && recipeDataCollectionTab === 0) {
                                                loadRecipes();
                                          }
                                    }}
                              >
                                    {recipes.map((recipe) => (
                                          <SwiperSlide key={recipe.id}>
                                                <div
                                                      onMouseDown={(e) => e.stopPropagation()}
                                                      onTouchStart={(e) => e.stopPropagation()}
                                                >
                                                      <DraggableRecipe recipe={recipe} source="slider" slideCard={true} />
                                                </div>
                                          </SwiperSlide>
                                    ))}
                              </Swiper>

                              {/* Swiper Arrows */}
                              <button
                                    ref={prevRef}
                                    className="custom-prev absolute top-1/2 left-0 sm:left-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                              >
                                    <ChevronLeft size={18} />
                              </button>
                              <button
                                    ref={nextRef}
                                    className="custom-next absolute top-1/2 right-0 sm:right-10 transform -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-colors"
                              >
                                    <ChevronRight size={18} />
                              </button>
                        </div>
                  )}
            </div>
      );
};

RecipeSlider.propTypes = {
      initialRecipes: propTypes.array,
};

export default RecipeSlider;
