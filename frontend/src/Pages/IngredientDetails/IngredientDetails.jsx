import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IngredientDetailsCard from "./IngredientDetailsCard.jsx";
import handleGetApi from "../../API/Handler/getApi.handler.js";
import querySearchApi from "../../API/Handler/querySearchApi.js";
import RecipeCard from "../../Components/DiscoverRecipes/RecipeCard/RecipeCard.jsx";

const IngredientDetails = () => {
      const { slug, id } = useParams(); // e.g. "onion"
      const [ingredient, setIngredient] = useState(null);
      const [extraData, setExtraData] = useState(null); // Field for extra API data
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [recipes, setRecipes] = useState([]);

      const apiUrl = "https://api.nal.usda.gov/fdc/v1/foods/search";
      const apiKey = import.meta.env.VITE_INGREDIENT_API_KEY; // Your USDA API key

      // Define your second API URL (replace with your actual URL)
      const secondApiUrl = `ingredient/${id}`;
      const fetchRecipes = async () => {
            if (!slug) return;
            try {
                  const response = await querySearchApi({ ingredient: slug, limit: 8 });
                  const newRecipes = response.data.recipes;

                  setRecipes(newRecipes);
            } catch (error) {
                  console.error("Error fetching recipes:", error);
            }
      };

      useEffect(() => {
            if (!slug) return;
            window.scrollTo(0, 0);
            setLoading(true);
            setError(null);

            // Create promises for both API calls
            const ingredientPromise = axios.get(
                  `${apiUrl}?query=${slug}&api_key=${apiKey}`
            );
            const extraDataPromise = handleGetApi(secondApiUrl);
            fetchRecipes();
            // Use Promise.all with .then() chaining
            Promise.all([ingredientPromise, extraDataPromise])
                  .then(([ingredientResponse, extraDataResponse]) => {
                        if (ingredientResponse.data?.foods?.length > 0) {
                              // Use the first match from the USDA API
                              setIngredient(ingredientResponse.data.foods[0]);
                        } else {
                              setError("No ingredient found");
                        }
                        // Set the extra data from your second API call
                        setExtraData(extraDataResponse.data);
                  })
                  .catch((err) => {
                        console.error(err);
                        setError("Failed to fetch ingredient details");
                  })
                  .finally(() => {
                        setLoading(false);
                  });
      }, [slug, apiKey, secondApiUrl]);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;

      console.log(recipes);

      return (
            <div>
                  <div className="container mx-auto p-4">
                        {ingredient && (
                              <IngredientDetailsCard ingredient={ingredient} extraData={extraData} />
                        )}
                  </div>

                  <div>
                        <div
                              className="flex items-center justify-center py-4"
                        >
                              <h2 className="text-2xl font-bold text-center">Recipes with {slug}</h2>
                        </div>
                        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {recipes?.map((recipe) => (
                                    <RecipeCard key={recipe._id} recipe={recipe} />
                              ))}
                        </div>

                  </div>
            </div>
      );
};

export default IngredientDetails;
