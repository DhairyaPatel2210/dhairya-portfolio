import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error("API base URL is not defined in environment variables");
}

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Include credentials for all requests
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add request interceptor to handle errors consistently
api.interceptors.request.use(
  (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method,
        url: config.url,
        headers: config.headers,
        withCredentials: config.withCredentials,
      });
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
    }
    return Promise.reject(error);
  }
);

export default api;
