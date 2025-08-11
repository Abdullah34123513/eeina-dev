import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import querySearchApi from "../../API/Handler/querySearchApi";
import DiscoverCardContainer from "../../Components/DiscoverRecipes/DiscoverCardContainer/DiscoverCardContainer";
import { useLang } from "../../context/LangContext";

const CategorySearchResults = () => {
      // Extract the 'slag' (or slug) from the URL parameters
      const { slag } = useParams();
      const [recipes, setRecipes] = useState([]);
      const {isArabic} = useLang();

      useEffect(() => {
            const fetchRecipes = async () => {
                  try {
                        // Call querySearchApi with an object of query parameters.
                        // Here, we are passing the 'slag' as 'slug' to filter the recipes.
                        const response = await querySearchApi({ category: slag });
                        setRecipes(response.data?.recipes);
                  } catch (error) {
                        console.error("Error fetching recipes:", error);
                  }
            };

            // Only fetch recipes when the 'slag' value changes
            if (slag) {
                  window.scrollTo(0, 0);
                  fetchRecipes();
            }
      }, [slag]);

      console.log(recipes)

      return (
            <div>
                  <h1
                        className="text-2xl"
                  >
                        {
                              isArabic ?
                                    "نتائج البحث" :
                                    "Search Results"
                        }
                        {
                              isArabic ?
                                    ` - ${slag.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase())}` :
                                    ` - ${slag.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase())}`
                        }
                  </h1>
                  {
                        recipes.length === 0 ?
                              <div
                                    className="flex justify-center items-center h-96"
                              >
                                    <h1 className="text-2xl">No recipes found</h1>
                              </div>
                              :
                              <DiscoverCardContainer
                                    recipes={recipes}
                              />}
            </div>
      );
};

export default CategorySearchResults;
