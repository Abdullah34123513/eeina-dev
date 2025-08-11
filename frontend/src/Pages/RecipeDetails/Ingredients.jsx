import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import handlePostApi from "../../API/Handler/postApi.handler";
import toast from "react-hot-toast";
import { useLang } from "../../context/LangContext";

const Ingredients = ({ ingredients, servings, recipeId, recipeTitle }) => {
      console.log("recipeTitle", recipeTitle);
      // Original servings from props, or default to 1 if not provided.
      const originalServings = servings || 1;
      const [currentServings, setCurrentServings] = useState(originalServings);
      const [showAll, setShowAll] = useState(false);
      const { isArabic } = useLang();

      // This state is used to simulate the list number for default naming.
      // const [listCount, setListCount] = useState(1);

      // Increment and decrement servings
      const handleIncrement = () => setCurrentServings(currentServings + 1);
      const handleDecrement = () => {
            if (currentServings > 1) {
                  setCurrentServings(currentServings - 1);
            }
      };

      // Show all ingredients if the user clicks the "See All" button
      const displayedIngredients = showAll ? ingredients : ingredients.slice(0, 12);

      // Handler for "Add to List" button click.
      const handleAddToList = async () => {
            try {
                  // Build the default list name using the current listCount.
                  const defaultListName = recipeTitle;
                  // Extract ingredient IDs from the ingredients array.
                  const ingredientIds = ingredients
                        .map((ingredient) => ingredient.details?._id)
                        .filter((id) => id); // Remove any undefined IDs

                  // Send a POST request to your API endpoint with the default name and ingredient list.
                  const response = await handlePostApi("list/create", {
                        listName: defaultListName,
                        list: ingredientIds,
                        recipeId: recipeId,
                  });

                  if (response?.statusCode === 201) {
                        toast.success(response?.message);
                  }

                  // Increment the listCount for subsequent creations.
                  // setListCount(prevCount => prevCount + 1);
            } catch (error) {
                  toast.error(error?.errMessage);
                  console.error("Error creating list:", error?.errMessage);
                  // Optionally, display an error notification here.
            }
      };

      return (
            <>
                  <div className="flex justify-center items-center">
                        <h1 className="text-3xl font-medium text-primary my-6">
                              {isArabic ? "المكونات" : "Ingredients"}
                        </h1>
                  </div>
                  <div className="max-w-28 flex items-center justify-center space-x-3 bg-btnSecondary text-white rounded-md shadow-md">
                        <div className="flex flex-col items-center justify-center">
                              <button
                                    onClick={handleIncrement}
                                    className="hover:text-gray-200 focus:outline-none"
                                    aria-label="Increase serving"
                              >
                                    <ChevronUp size={20} />
                              </button>
                              <button
                                    onClick={handleDecrement}
                                    className="hover:text-gray-200 focus:outline-none"
                                    aria-label="Decrease serving"
                              >
                                    <ChevronDown size={20} />
                              </button>
                        </div>
                        <span className="font-semibold text-sm"
                              dir={isArabic ? "rtl" : "ltr"}
                        >
                              {currentServings}
                              {isArabic ? "حصص" : "Serving"}
                              {currentServings > 1 ? "s" : ""}
                        </span>
                  </div>

                  <div className="mt-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 items-start">
                              {displayedIngredients.map((ingredient, index) => {
                                    // Calculate the multiplier based on current servings vs original servings.
                                    const multiplier = currentServings / originalServings;
                                    const scaledAmount = ingredient.amount * multiplier;
                                    const slug = ingredient.nameClean?.en
                                          .replace(/\s+/g, "-")
                                          .toLowerCase();
                                    return (
                                          <Link
                                                to={`/ingredient/details/${slug}/${ingredient.details?._id}`}
                                                key={index}
                                                className="flex flex-col items-center"
                                          >
                                                <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-300">
                                                      <img
                                                            className="w-full h-full object-cover"
                                                            src={
                                                                  ingredient?.details?.image?.url ||
                                                                  "https://eeina.s3.ap-south-1.amazonaws.com/uploads/Food-Ingredients.jpg"
                                                            }
                                                            alt={ingredient?.nameClean?.en}
                                                      />
                                                </div>
                                                <p
                                                      className="text-black leading-3 text-center mt-2 max-w-32"
                                                      dir={isArabic ? "rtl" : "ltr"}
                                                >
                                                      {scaledAmount.toFixed(2)}{" "}
                                                      {isArabic
                                                            ? ingredient?.unit?.ar
                                                            : ingredient?.unit?.en}{" "}
                                                      {isArabic
                                                            ? ingredient?.nameClean?.ar
                                                            : ingredient?.nameClean?.en}
                                                </p>
                                          </Link>
                                    );
                              })}
                        </div>

                        <div className="flex justify-between items-center mt-8">
                              <div>
                                    {ingredients.length > 9 && !showAll && (
                                          <div className="mt-4 text-center">
                                                <button
                                                      onClick={() => setShowAll(true)}
                                                      className="text-blue-500 hover:underline"
                                                >
                                                      {isArabic ? "عرض الكل" : "See All"}
                                                </button>
                                          </div>
                                    )}
                              </div>
                              <div className="flex items-center justify-end">
                                    <button
                                          onClick={handleAddToList}
                                          className="w-48 bg-btnSecondary text-white font-medium px-4 py-3 rounded-md"
                                    >
                                          {isArabic ? "إضافة إلى القائمة" : "Add to List"}
                                    </button>
                              </div>
                        </div>
                  </div>
            </>
      );
};

Ingredients.propTypes = {
      ingredients: PropTypes.array.isRequired,
      servings: PropTypes.number,
      recipeId: PropTypes.string,
      recipeTitle: PropTypes.string,
};

export default Ingredients;
