import axios from "axios";
import { store } from "@/store/store";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error("API base URL is not defined in environment variables");
}

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle errors consistently
api.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const token = store.getState().auth.token;

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Log detailed error in development
      if (import.meta.env.DEV) {
        console.error("API Error:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      // Network or CORS error
      if (error.code === "ERR_NETWORK") {
        console.error("Network Error. Possible causes:", {
          serverDown: "Backend server might not be running",
          cors: "CORS might be blocking the request",
          network: "Network connectivity issues",
        });
      }

      // If we get a 401 Unauthorized error, clear the token and auth state
      if (error.response?.status === 401) {
        store.dispatch({ type: "auth/logout" });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
