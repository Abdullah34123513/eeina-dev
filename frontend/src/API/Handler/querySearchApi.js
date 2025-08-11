import { apiClient } from "../../Constant/api.constant";

/**
 * Fetches recipes from the API based on slug, ingredient, or category.
 *
 * @param {object} params - Query parameters for filtering recipes.
 * @param {string} [params.slug] - Recipe slug (optional).
 * @param {string} [params.ingredient] - Ingredient to filter by (optional).
 * @param {string} [params.category] - Category to filter by (optional).
 * @returns {Promise<object>} - The response data.
 * @throws Will throw an error if the API call fails.
 */
const querySearchApi = async ({  ingredient, category }) => {
      try {
            let collection = "recipe/search/query";

            const queryParams = {};
            if (ingredient) queryParams.ingredient = ingredient;
            if (category) queryParams.category = category;

            const { data: response } = await apiClient.get(`/${collection}`, { params: queryParams });
            return response;
      } catch (error) {
            console.error("API GET error:", error?.response?.data || error.message);
            throw error;
      }
};

export default querySearchApi;
