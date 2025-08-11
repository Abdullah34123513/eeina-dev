import { useEffect, useState } from "react";
import RecipeCard from "../../Components/DiscoverRecipes/RecipeCard/RecipeCard";
import handleGetApi from "../../API/Handler/getApi.handler";
import { useLang } from "../../context/LangContext";

import PropTypes from "prop-types";

const SkeletonRecipeCard = ({ isArabic }) => {
      return (
            <div className={`block w-full animate-pulse ${isArabic ? "text-right" : "text-left"}`}>
                  <div className="aspect-square bg-gray-200 rounded-2xl mb-3"></div>
                  <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                  </div>
            </div>
      );
};

SkeletonRecipeCard.propTypes = {
      isArabic: PropTypes.bool.isRequired,
};

const Saved = () => {
      const [saved, setSaved] = useState([]);
      const [loading, setLoading] = useState(true);
      const { isArabic } = useLang();

      const getSaved = async () => {
            try {
                  const res = await handleGetApi("recipe-user");
                  if (res?.statusCode === 200) setSaved(res.data);
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => { getSaved(); }, []);

      return (
            <div dir={isArabic ? "rtl" : "ltr"} className="py-8 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                        <h1 className={`text-4xl font-bold mb-8 ${isArabic ? "font-arabic" : "font-display"}`}>
                              {isArabic ? "الوصفات المحفوظة" : "Saved Recipes"}
                        </h1>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                              {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                          <SkeletonRecipeCard key={i} isArabic={isArabic} />
                                    ))
                              ) : (
                                    saved.map((recipe) => (
                                          <RecipeCard
                                                key={recipe._id}
                                                recipe={recipe}
                                                className="transition-transform duration-300 hover:scale-105"
                                          />
                                    ))
                              )}
                        </div>

                        {!loading && saved.length === 0 && (
                              <div className={`text-center py-12 text-gray-500 ${isArabic ? "font-arabic" : ""}`}>
                                    {isArabic ? "لا توجد وصفات محفوظة" : "No saved recipes found"}
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default Saved;