import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL env variable is missing!");
}

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

console.log("ENV:", import.meta.env.VITE_API_BASE_URL);
console.log("AXIOS BASE URL:", baseURL);

API.interceptors.request.use((config) => {
  console.log("REQUEST URL:", config.baseURL! + config.url!);
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const response = error?.response;
    const data = response?.data;
    const status = response?.status;

    if (!response) {
      // Network-level error (server down, CORS, no network, etc.)
      const customError: CustomError = {
        ...error,
        message: `Network Error: Unable to reach ${baseURL || "server"}. Ensure the backend is running and CORS is configured.`,
        errorCode: "NETWORK_ERROR",
      };
      return Promise.reject(customError);
    }

    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }

    const customError: CustomError = {
      ...error,
      message: data?.message || error?.message,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
