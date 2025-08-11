import { apiClient } from "../../constant/api.constant";

const handleApi = async (collection, method, data = null) => {
      try {
            const config = {
                  method: method.toLowerCase(),
                  url: `/${collection}`,
                  // If it's a GET request, use `params`, otherwise use `data`
                  ...(method.toLowerCase() === "get"
                        ? { params: data }
                        : method.toLowerCase() === "delete" && data
                        ? { data } // DETELE: send data if req body is provided
                        : { data }), // POST/PUT: send data in req body
            };

            const { data: response } = await apiClient.request(config);
            return response;
      } catch (error) {
            console.error(
                  `API ${method} error:`,
                  error?.response?.data || error.message
            );
            throw error;
      }
};

export default handleApi;
