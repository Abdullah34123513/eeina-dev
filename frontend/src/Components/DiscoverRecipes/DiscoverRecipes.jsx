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
            <div>
                  <div className="w-full flex flex-col items-center justify-center space-y-4">
                        <div className="flex justify-between items-center">
                              <Link
                                    to={`/search`}
                              >
                                    <h2
                                          className="text-gray-900 text-4xl font-oswald font-normal underline"
                                          dir={isArabic ? "rtl" : "ltr"}
                                    >
                                          {exploreDiscoverTitle}
                                    </h2>
                              </Link>
                        </div>
                        <div>
                              <p
                                    className="text-gray-600 text-md hidden md:block"
                                    dir={isArabic ? "rtl" : "ltr"}
                              >
                                    {exploreSub}
                              </p>
                        </div>
                  </div>

                  <InfiniteScroll
                        dataLength={recipes.length}
                        next={fetchRecipes}
                        hasMore={hasMoreRecipes}
                        loader={
                              <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
                                    <div className="relative w-full min-h-[250px] bg-gray-300 rounded-2xl overflow-hidden animate-pulse">
                                          <div className="absolute top-2 left-2">
                                                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                          </div>
                                          <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                          </div>
                                          <div className="absolute bottom-2 left-2">
                                                <div className="w-16 h-4 bg-gray-400 rounded"></div>
                                          </div>
                                          <div className="absolute bottom-2 right-2">
                                                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                                          </div>
                                    </div>
                                    <div className="mt-2">
                                          <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                    <div className="mt-2">
                                          <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                                    </div>
                              </div>
                        }
                        // Optionally, you can adjust the scrollThreshold if needed.
                        scrollThreshold="300px"
                  >
                        <DiscoverCardContainer recipes={recipes} />
                  </InfiniteScroll>
            </div>
      );
};

export default DiscoverRecipes;
