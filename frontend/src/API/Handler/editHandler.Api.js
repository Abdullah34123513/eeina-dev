import { apiClient } from "../../Constant/api.constant";

/**
 * Makes a PUT request to the specified API collection/endpoint with the provided data.
 *
 * @param {string} collection - The API collection/endpoint (without leading slash).
 * @param {object} data - The data to be sent in the request body.
 * @returns {Promise<object>} - The response data.
 * @throws Will throw an error if the API call fails.
 */
const handleEditApi = async (collection, data) => {
      try {
            const { data: response } = await apiClient.put(`/${collection}`, data);
            return response; // Return response directly for further processing
      } catch (error) {
            console.error("API EDIT error:", error?.response?.data || error.message);
            throw error; // Rethrow error for upstream handling if needed
      }
};

export default handleEditApi;
