import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import handleGetApi from "../../API/Handler/getApi.handler";
import DiscoverCardContainer from "../../Components/DiscoverRecipes/DiscoverCardContainer/DiscoverCardContainer";
import { useLang } from "../../context/LangContext";

// Helper to parse JSON arrays or comma-separated lists
const parseParamArray = (param) => {
      if (!param) return [];
      const decoded = decodeURIComponent(param);
      try {
            const parsed = JSON.parse(decoded);
            if (Array.isArray(parsed)) return parsed;
      } catch (e) {
            // not JSON, fallback to CSV
      }
      return decoded.split(",").map(item => item.trim()).filter(item => item);
};

const SearchPage = () => {
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const { isArabic } = useLang();

      // Extract query params
      const keyword = searchParams.get("keyword") || "";
      const ingredientsParam = searchParams.get("ingredients");
      const categoriesParam = searchParams.get("categories");
      const cuisinesParam = searchParams.get("cuisines");
      const dietsParam = searchParams.get("diets");
      const healthLabelsParam = searchParams.get("healthLabels");
      const cookTimeParams = searchParams.get("cookTime");

      // Parse arrays safely
      const ingredients = parseParamArray(ingredientsParam);
      const categories = parseParamArray(categoriesParam);
      const cuisines = parseParamArray(cuisinesParam);
      const diets = parseParamArray(dietsParam);
      const healthLabels = parseParamArray(healthLabelsParam);

      // Map cookTime label to numeric filter
      let cookTime = null;
      if (cookTimeParams) {
            switch (cookTimeParams) {
                  case "Under 30 minutes":
                        cookTime = 30;
                        break;
                  case "Under 1 hour":
                        cookTime = 60;
                        break;
                  case "Under 2 hours":
                        cookTime = 120;
                        break;
                  case "Over 2 hours":
                        cookTime = 121;
                        break;
                  default:
                        cookTime = null;
            }
      }

      // Infinite scroll state
      const [recipes, setRecipes] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(0);
      const [hasMore, setHasMore] = useState(true);
      const [loading, setLoading] = useState(false);

      // Fetch a specific page
      const fetchSearchPage = async (page) => {
            setLoading(true);
            try {
                  const params = new URLSearchParams({
                        keyword,
                        ingredients: JSON.stringify(ingredients),
                        categories: JSON.stringify(categories),
                        cuisines: JSON.stringify(cuisines),
                        diets: JSON.stringify(diets),
                        healthLabels: JSON.stringify(healthLabels),
                        cookTime,
                        page,
                        limit: 30
                  }).toString();

                  const response = await handleGetApi(`search/query?${params}`);
                  const { mainRecipe, similarRecipes, pagination } = response.data;

                  const newItems = page === 1 ? [...mainRecipe, ...similarRecipes] : similarRecipes;

                  setRecipes(prev => [...prev, ...newItems]);
                  setCurrentPage(page);
                  setTotalPages(pagination.totalPages);
                  setHasMore(page < pagination.totalPages);
            } catch (error) {
                  console.error("Error fetching search results:", error);
            }
            setLoading(false);
      };

      // Reset on search change
      useEffect(() => {
            setRecipes([]);
            setCurrentPage(1);
            setTotalPages(0);
            setHasMore(true);
            fetchSearchPage(1);
      }, [location.search]);

      // Load more
      const fetchMoreData = () => {
            if (hasMore) fetchSearchPage(currentPage + 1);
      };

      if (!loading && recipes.length === 0) {
            return <p className="text-center">
                  {isArabic ? "لا توجد نتائج مطابقة" : "No matching results"}
                  <br />
                  {isArabic ? "حاول تغيير معايير البحث." : "Try changing your search criteria."}
            </p>;
      }

      return (
            <InfiniteScroll
                  dataLength={recipes.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<p className="text-center">
                        {isArabic ? "جارٍ تحميل المزيد..." : "Loading more..."}
                  </p>}
                  endMessage={<p className="text-center">
                        {isArabic ? "لا توجد المزيد من النتائج" : "No more results"}
                  </p>}
            >
                  <DiscoverCardContainer recipes={recipes} searchPage />
            </InfiniteScroll>
      );
};

export default SearchPage;
