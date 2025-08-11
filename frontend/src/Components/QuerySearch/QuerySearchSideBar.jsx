import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import useTextLangChange from "../../Constant/text.constant";

const QuerySearchSideBar = ({ topIngredients, topCategory, cuisines = [], dietLabels = [], healthLabels = [] }) => {
      const [searchParams, setSearchParams] = useSearchParams();
      const { isArabic } = useLang();
      const {
            popularIngredients,
            mealTypeTitle,
            cuisineTitle,
            dietLabelsTitle,
            healthLabelsTitle,
            cookingTimeTitle,
      } = useTextLangChange();



      const [selectedIngredients, setSelectedIngredients] = useState([]);
      const [selectedCategories, setSelectedCategories] = useState([]);
      const [selectedCuisines, setSelectedCuisines] = useState([]);
      const [selectedDietLabels, setSelectedDietLabels] = useState([]);
      const [selectedHealthLabels, setSelectedHealthLabels] = useState([]);
      const [selectedCookingTime, setSelectedCookingTime] = useState([]);

      const [showAllIngredients, setShowAllIngredients] = useState(false);
      const [showAllCategories, setShowAllCategories] = useState(false);
      const [showAllCuisines, setShowAllCuisines] = useState(false);
      const [showAllDietLabels, setShowAllDietLabels] = useState(false);
      const [showAllHealthLabels, setShowAllHealthLabels] = useState(false);


      useEffect(() => {
            const ingredientsFromUrl = searchParams.get("ingredients")?.split(",") || [];
            const categoriesFromUrl = searchParams.get("categories")?.split(",") || [];
            const cuisinesFromUrl = searchParams.get("cuisines")?.split(",") || [];
            const dietLabelsFromUrl = searchParams.get("dietLabels")?.split(",") || [];
            const healthLabelsFromUrl = searchParams.get("healthLabels")?.split(",") || [];


            setSelectedIngredients(ingredientsFromUrl.filter(Boolean));
            setSelectedCategories(categoriesFromUrl.filter(Boolean));
            setSelectedCuisines(cuisinesFromUrl.filter(Boolean));
            setSelectedDietLabels(dietLabelsFromUrl.filter(Boolean));
            setSelectedHealthLabels(healthLabelsFromUrl.filter(Boolean));

      }, [searchParams]);

      const toggleShowAllIngredients = () => setShowAllIngredients(!showAllIngredients);
      const toggleShowAllCategories = () => setShowAllCategories(!showAllCategories);
      const toggleShowAllCuisines = () => setShowAllCuisines(!showAllCuisines);
      const toggleShowAllDietLabels = () => setShowAllDietLabels(!showAllDietLabels);
      const toggleShowAllHealthLabels = () => setShowAllHealthLabels(!showAllHealthLabels);



      const handleToggleSelection = (query, type) => {
            let updatedSelections;

            switch (type) {
                  case "ingredient":
                        updatedSelections = selectedIngredients.includes(query)
                              ? selectedIngredients.filter(item => item !== query)
                              : [...selectedIngredients, query];
                        setSelectedIngredients(updatedSelections);
                        break;
                  case "category":
                        updatedSelections = selectedCategories.includes(query)
                              ? selectedCategories.filter(item => item !== query)
                              : [...selectedCategories, query];
                        setSelectedCategories(updatedSelections);
                        break;
                  case "cuisine":
                        updatedSelections = selectedCuisines.includes(query)
                              ? selectedCuisines.filter(item => item !== query)
                              : [...selectedCuisines, query];
                        setSelectedCuisines(updatedSelections);
                        break;
                  case "dietLabel":
                        updatedSelections = selectedDietLabels.includes(query)
                              ? selectedDietLabels.filter(item => item !== query)
                              : [...selectedDietLabels, query];
                        setSelectedDietLabels(updatedSelections);
                        break;
                  case "healthLabel":
                        updatedSelections = selectedHealthLabels.includes(query)
                              ? selectedHealthLabels.filter(item => item !== query)
                              : [...selectedHealthLabels, query];
                        setSelectedHealthLabels(updatedSelections);
                        break;
                  case "cookingTime":
                        // Allow only one selection at a time
                        updatedSelections = selectedCookingTime.includes(query) ? [] : [query];
                        setSelectedCookingTime(updatedSelections);
                        break;
                  default:
                        return;
            }

            updateSearchParams(updatedSelections, type);
      };


      const updateSearchParams = (updatedSelections, type) => {
            const newParams = new URLSearchParams(searchParams);

            switch (type) {
                  case "ingredient":
                        newParams.set("ingredients", updatedSelections.join(","));
                        break;
                  case "category":
                        newParams.set("categories", updatedSelections.join(","));
                        break;
                  case "cuisine":
                        newParams.set("cuisines", updatedSelections.join(","));
                        break;
                  case "dietLabel":
                        newParams.set("dietLabels", updatedSelections.join(","));
                        break;
                  case "healthLabel":
                        newParams.set("healthLabels", updatedSelections.join(","));
                        break;
                  case "cookingTime":
                        newParams.set("cookTime", updatedSelections[0]);
                        break;
            }

            setSearchParams(newParams, { replace: true });
      };


      return (
            <div>
                  {/* Popular Ingredients */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {popularIngredients}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(showAllIngredients ? topIngredients : topIngredients.slice(0, 10)).map((ingredient, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(ingredient._id?.en, "ingredient")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedIngredients.includes(ingredient._id?.en)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {isArabic ? ingredient?._id?.ar : ingredient?._id?.en} {ingredient.count && `(${ingredient.count})`}
                                    </button>
                              ))}
                        </div>
                        {topIngredients.length > 10 && (
                              <button
                                    onClick={toggleShowAllIngredients}
                                    className="mt-2 text-primary hover:underline"
                              >
                                    {showAllIngredients ? "See Less" : "See All"}
                              </button>
                        )}
                  </div>

                  {/* Popular Categories */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {mealTypeTitle}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(showAllCategories ? topCategory : topCategory.slice(0, 10)).map((category, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(category._id?.en, "category")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedCategories.includes(category._id?.en)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {isArabic ? category?._id?.ar : category?._id?.en}
                                    </button>
                              ))}
                        </div>
                        {topCategory.length > 10 && (
                              <button
                                    onClick={toggleShowAllCategories}
                                    className="mt-2 text-primary hover:underline"
                              >
                                    {showAllCategories ? "See Less" : "See All"}
                              </button>
                        )}
                  </div>

                  {/* Cuisines */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {cuisineTitle}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(showAllCuisines ? cuisines : cuisines.slice(0, 10)).map((cuisine, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(cuisine.name?.en, "cuisine")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedCuisines.includes(cuisine?.name?.en)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {isArabic ? cuisine?.name?.ar : cuisine?.name?.en}
                                    </button>
                              ))}
                        </div>
                        {
                              cuisines.length > 10 && (
                                    <button
                                          onClick={toggleShowAllCuisines}
                                          className="mt-2 text-primary hover:underline"
                                    >
                                          {showAllCuisines ? "See Less" : "See All"}
                                    </button>
                              )
                        }
                  </div>

                  {/* Diet Labels */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {dietLabelsTitle}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(showAllDietLabels ? dietLabels : dietLabels.slice(0, 10)).map((dietLabel, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(dietLabel.name?.en, "dietLabel")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedDietLabels.includes(dietLabel?.name?.en)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {isArabic ? dietLabel?.name?.ar : dietLabel?.name?.en}
                                    </button>
                              ))}
                        </div>
                        {
                              dietLabels.length > 10 && (
                                    <button
                                          onClick={toggleShowAllDietLabels}
                                          className="mt-2 text-primary hover:underline"
                                    >
                                          {showAllDietLabels ? "See Less" : "See All"}
                                    </button>
                              )
                        }
                  </div>

                  {/* Health Labels */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {healthLabelsTitle}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {(showAllHealthLabels ? healthLabels : healthLabels.slice(0, 10)).map((healthLabel, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(healthLabel.name?.en, "healthLabel")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedHealthLabels.includes(healthLabel?.name?.en)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {isArabic ? healthLabel?.name?.ar : healthLabel?.name?.en}
                                    </button>
                              ))}
                        </div>
                        {
                              healthLabels.length > 10 && (
                                    <button
                                          onClick={toggleShowAllHealthLabels}
                                          className="mt-2 text-primary hover:underline"
                                    >
                                          {showAllHealthLabels ? "See Less" : "See All"}
                                    </button>
                              )
                        }
                  </div>

                  {/* Cooking Time */}
                  <div className="mt-4">
                        <h2
                              className="text-lg font-semibold"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {cookingTimeTitle}
                        </h2>
                        <div
                              className="flex flex-wrap gap-2 mt-2"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {[{ name: "Under 30 minutes" }, { name: "Under 1 hour" }, { name: "Under 2 hours" }, { name: "Over 2 hours" }].map((cookingTime, index) => (
                                    <button
                                          key={index}
                                          onClick={() => handleToggleSelection(cookingTime.name, "cookingTime")}
                                          className={`border px-2 py-1 rounded-lg focus:outline-none ${selectedCookingTime.includes(cookingTime?.name)
                                                ? "border-primary text-primary"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                    >
                                          {cookingTime?.name}
                                    </button>
                              ))}
                        </div>
                  </div>
            </div>
      );
};

QuerySearchSideBar.propTypes = {
      topIngredients: propTypes.array.isRequired,
      topCategory: propTypes.array.isRequired,
      cuisines: propTypes.array.isRequired,
      dietLabels: propTypes.array.isRequired,
      healthLabels: propTypes.array.isRequired,
};

export default QuerySearchSideBar;
