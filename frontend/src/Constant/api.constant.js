import axios from "axios";
// This file is used to create an API client for making HTTP requests.


const isDev = import.meta.env.VITE_NODE_ENV === "development";

const baseURL = isDev
      ? "http://localhost:5050/api/v1"
      : "/api/v1";

console.log("API Client initialized with base URL:", baseURL, import.meta.env.VITE_NODE_ENV);

export const apiClient = axios.create({
      baseURL,
      withCredentials: true,
});
