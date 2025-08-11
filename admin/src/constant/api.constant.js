import axios from "axios";

// Create a pre-configured axios instance
export const apiClient = axios.create({
      baseURL: "/api/v1",
      withCredentials: true, // Allow credentials (cookies)
});
