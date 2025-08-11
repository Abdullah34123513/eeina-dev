import { apiClient } from "../../Constant/api.constant";

/**
 * Makes a DELETE request to the specified API collection with the provided id.
 *
 * @param {string} collection - The API collection/endpoint (without leading slash).
 * @param {string|number} id - The unique identifier of the resource to delete.
 * @param {object} [config] - Optional axios configuration.
 * @returns {Promise<object>} - The response data.
 * @throws Will throw an error if the API call fails.
 */
const handleDeleteApi = async (collection, id, data, config = {}) => {
      try {
            const { data: response } = await apiClient.delete(`/${collection}/${id}`, {
                  ...config,
                  data
            });
            return response; // Return response directly for further processing
      } catch (error) {
            console.error("API DELETE error:", error?.response?.data || error.message);
            throw error; // Rethrow error for upstream handling if needed
      }
};

export default handleDeleteApi;
