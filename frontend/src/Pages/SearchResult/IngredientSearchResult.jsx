import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import querySearchApi from "../../API/Handler/querySearchApi";
import DiscoverCardContainer from "../../Components/DiscoverRecipes/DiscoverCardContainer/DiscoverCardContainer";
import { useLang } from "../../context/LangContext";

const IngredientSearchResult = () => {
      const { slag } = useParams();
      const [recipes, setRecipes] = useState([]);
      const [page, setPage] = useState(0);
      const [hasMore, setHasMore] = useState(true);
      const observer = useRef();
      const { isArabic } = useLang();

      const fetchRecipes = async () => {
            if (!slag) return;
            try {
                  const response = await querySearchApi({ ingredient: slag, limit: 10, skip: page * 10 });
                  const newRecipes = response.data.recipes;

                  // If fewer than 10 recipes are returned, we've reached the end
                  if (newRecipes.length < 10) {
                        setHasMore(false);
                  }

                  setRecipes((prev) => [...prev, ...newRecipes]);
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            }
      };

      useEffect(() => {
            window.scrollTo(0, 0);
            setRecipes([]); // Reset recipes when slag changes
            setPage(0);
            setHasMore(true);
      }, [slag]);

      useEffect(() => {
            fetchRecipes();
      }, [page]);

      // Intersection Observer for Infinite Scroll
      const lastRecipeElementRef = useCallback(
            (node) => {
                  if (observer.current) observer.current.disconnect();
                  observer.current = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && hasMore) {
                              setPage((prev) => prev + 1);
                        }
                  });
                  if (node) observer.current.observe(node);
            },
            [hasMore]
      );

      return (
            <div>
                  <h1 className="text-2xl">
                        {
                              isArabic ?
                                    "نتائج البحث" :
                                    "Search Results"
                        }{" "}
                        <span className="text-primary">
                              {slag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                        </span>
                  </h1>
                  {
                        recipes.length === 0 ? (
                              <div className="flex justify-center items-center h-96">
                                    <h1 className="text-2xl">
                                          {
                                                isArabic ?
                                                      "لا توجد نتائج مطابقة" :
                                                      "No matching results"
                                          }
                                    </h1>
                              </div>
                        ) :
                              <DiscoverCardContainer
                                    recipes={recipes}
                                    lastRecipeElementRef={lastRecipeElementRef} // Pass ref to the last recipe
                              />}
                  {hasMore && <p className="text-center py-4 text-gray-600">
                        {
                              isArabic ?
                                    "جارٍ تحميل المزيد..." :
                                    "Loading more..."
                        }
                  </p>}
            </div>
      );
};

export default IngredientSearchResult;
