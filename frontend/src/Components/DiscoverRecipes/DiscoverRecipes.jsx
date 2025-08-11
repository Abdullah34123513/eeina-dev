import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DiscoverCardContainer from "./DiscoverCardContainer/DiscoverCardContainer";
import handleGetApi from "../../API/Handler/getApi.handler";
import useTextLangChange from "../../Constant/text.constant";
import { useLang } from "../../context/LangContext";

const DiscoverRecipes = () => {
      const [recipes, setRecipes] = useState([]);
      const [page, setPage] = useState(1);
      const [hasMoreRecipes, setHasMoreRecipes] = useState(true);
      const [loading, setLoading] = useState(false);
      const { isArabic } = useLang();
      const {
            exploreDiscoverTitle,
            exploreSub
      } = useTextLangChange();

      // Helper function to merge recipes based on unique _id
      const mergeRecipes = (oldRecipes, newRecipes) => {
            const map = new Map();
            oldRecipes.forEach((recipe) => map.set(recipe._id, recipe));
            newRecipes.forEach((recipe) => map.set(recipe._id, recipe));
            return Array.from(map.values());
      };

      // Function to fetch recipes from the API (30 per call)
      const fetchRecipes = async () => {
            // Prevent duplicate calls if one is already in progress
            if (loading || !hasMoreRecipes) return;
            setLoading(true);
            try {
                  const response = await handleGetApi(`recipe?page=${page}&limit=30`);
                  const newRecipes = response?.data || [];

                  if (newRecipes.length === 0) {
                        setHasMoreRecipes(false);
                  } else {
                        setRecipes((prevRecipes) => mergeRecipes(prevRecipes, newRecipes));
                        setPage((prev) => prev + 1);
                  }
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            } finally {
                  setLoading(false);
            }
      };

      // On mount, fetch the first page of recipes.
      useEffect(() => {
            fetchRecipes();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
            <div className="section-padding bg-gradient-to-b from-white to-primary-50/30">
                  <div className="w-full flex flex-col items-center justify-center space-y-6 mb-12">
                        <div className="flex justify-between items-center">
                              <Link
                                    to={`/search`}
                              >
                                    <h2
                                          className="text-4xl lg:text-5xl font-bold font-display gradient-text hover:scale-105 transition-transform duration-300"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {exploreDiscoverTitle}
                                    </h2>
                              </Link>
                        </div>
                        <div>
                              <p
                                    className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed text-center"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {exploreSub}
                              </p>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="flex items-center space-x-4">
                              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                  </div>

                  <InfiniteScroll
                        dataLength={recipes.length}
                        next={fetchRecipes}
                        hasMore={hasMoreRecipes}
                        loader={
                              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-12">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                          <div key={i} className="relative w-full min-h-[280px] bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl overflow-hidden animate-pulse">
                                                <div className="absolute top-4 left-4">
                                                      <div className="w-8 h-8 bg-neutral-400 rounded-full"></div>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                      <div className="w-8 h-8 bg-neutral-400 rounded-full"></div>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4">
                                                      <div className="h-6 bg-neutral-400 rounded-lg mb-2"></div>
                                                      <div className="h-4 bg-neutral-400 rounded w-3/4"></div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        }
                        // Optionally, you can adjust the scrollThreshold if needed.
                        scrollThreshold="200px"
                  >
                        <DiscoverCardContainer recipes={recipes} />
                  </InfiniteScroll>
            </div>
      );
};

export default DiscoverRecipes;
