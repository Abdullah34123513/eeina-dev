import { useEffect, useState, useRef, useCallback } from "react";
import handleGetApi from "../../API/Handler/getApi.handler";
import FeedRecipeCard from "../../Components/FeedComponents/FeedRecipeCard";
import RecipeCard from "../../Components/DiscoverRecipes/RecipeCard/RecipeCard";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules"; // ✅ Correct way
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "../../context/LangContext";


const Feed = () => {
      const [recipes, setRecipes] = useState([]);
      const [popularRecipes, setPopularRecipes] = useState([]);
      const [page, setPage] = useState(0); // Page index (0-based)
      const [hasMore, setHasMore] = useState(true);
      const observer = useRef();
      const { isArabic } = useLang();


      // Refs for custom navigation buttons
      const prevRef = useRef(null);
      const nextRef = useRef(null);

      // Load recipes from the backend using limit and skip parameters
      const loadRecipes = async () => {
            try {
                  // Calculate skip based on page number (10 recipes per page)
                  const skip = page * 10;
                  const res = await handleGetApi(`recipe/random?limit=10&skip=${skip}`);
                  const newRecipes = res.data;

                  // If fewer than 10 recipes are returned, we've reached the end
                  if (newRecipes.length < 10) {
                        setHasMore(false);
                  }
                  // Append new recipes to existing list
                  setRecipes((prev) => [...prev, ...newRecipes]);
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            }
      };

      const fetchPopularRecipes = async () => {
            try {
                  const res = await handleGetApi("recipe/popular");
                  setPopularRecipes(res?.data);
            } catch (error) {
                  console.error("Error fetching popular recipes:", error);
            }
      };

      // Load recipes when the page changes
      useEffect(() => {
            loadRecipes();
      }, [page]);

      useEffect(() => {
            fetchPopularRecipes();
      }, []);

      // Use an IntersectionObserver to detect when the last recipe card is visible
      const lastRecipeElementRef = useCallback(
            (node) => {
                  if (observer.current) observer.current.disconnect();
                  observer.current = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && hasMore) {
                              setPage((prevPage) => prevPage + 1);
                        }
                  });
                  if (node) observer.current.observe(node);
            },
            [hasMore]
      );

      return (
            <div className="space-y-6">
                  {/* Popular Recipes Slider */}
                  <div className="p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-xl bg-white relative">
                        <h1
                              className="text-2xl font-bold text-gray-800 mb-4"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {
                                    isArabic ? "الوصفات الأكثر شعبية" : "Popular Recipes"
                              }
                        </h1>

                        {/* Custom Navigation Buttons */}
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

                        <Swiper
                              modules={[Navigation]}
                              spaceBetween={20}
                              slidesPerView={1}
                              breakpoints={{
                                    640: { slidesPerView: 1.5 },
                                    1024: { slidesPerView: 2 },
                              }}
                              navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                              }}
                              onBeforeInit={(swiper) => {
                                    // eslint-disable-next-line no-param-reassign
                                    swiper.params.navigation.prevEl = prevRef.current;
                                    // eslint-disable-next-line no-param-reassign
                                    swiper.params.navigation.nextEl = nextRef.current;
                              }}
                        >
                              {popularRecipes.map((recipe) => (
                                    <SwiperSlide key={recipe._id}>
                                          <RecipeCard recipe={recipe} />
                                    </SwiperSlide>
                              ))}
                        </Swiper>
                  </div>

                  {/* Recipe List with Infinite Scroll */}
                  <div className="grid grid-cols-1 gap-10">
                        {recipes.map((recipe, index) => {
                              // Attach the ref to the last recipe element for infinite scroll
                              if (recipes.length === index + 1) {
                                    return (
                                          <div key={recipe._id} ref={lastRecipeElementRef}>
                                                <FeedRecipeCard recipe={recipe} />
                                          </div>
                                    );
                              } else {
                                    return (
                                          <div key={recipe._id}>
                                                <FeedRecipeCard recipe={recipe} />
                                          </div>
                                    );
                              }
                        })}
                  </div>
                  {hasMore && (
                        <p
                              className="text-center py-4 text-gray-600"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {
                                    isArabic ? "تحميل المزيد..." : "Loading more..."
                              }
                        </p>
                  )}
            </div>
      );
};

export default Feed;
