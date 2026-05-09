import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import toast from "react-hot-toast";
import {
  retrieveFromLocalStorage,
  removeFromLocalStorage,
} from "./localStorage";
import { convertCamelToSnake, convertSnakeToCamel } from "./caseTransform";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

function createAxiosInstance(baseURL: string) {
  const instance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
    },
  });

  // ── Request interceptor ────────────────────────────────────────────────────
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Convert camelCase body to snake_case for the API
    if (config.data && !(config.data instanceof FormData)) {
      config.data = convertCamelToSnake(config.data);
    }

    // Attach JWT
    const token = retrieveFromLocalStorage<string>("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Attach tenant subdomain for tenant-scoped requests
    const subdomain = retrieveFromLocalStorage<string>("subdomain");
    if (subdomain) {
      config.headers["X-Tenant-Subdomain"] = subdomain;
    }

    return config;
  });

  // ── Response interceptor ──────────────────────────────────────────────────
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data?.data) {
        response.data.data = convertSnakeToCamel(response.data.data);
      }

      // Auto-save token if returned
      if (response.data?.data?.token) {
        // Handled by auth hooks
      }

      return response;
    },
    (error: AxiosError<{ message?: string; success?: boolean }>) => {
      const status = error.response?.status;
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Something went wrong.";

      if (status === 401) {
        removeFromLocalStorage("token");
        removeFromLocalStorage("user");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login" &&
          !window.location.pathname.startsWith("/exam/")
        ) {
          window.location.href = "/login";
        }
      } else if (status !== 404 && status !== 422) {
        // 404 = not found, handled at component level; 422 = validation, handled at form level
        toast.error(message);
      }

      // Rethrow with the extracted message so hook onError handlers get a clean Error
      return Promise.reject(new Error(message));
    },
  );

  return instance;
}

// Public API (no tenant prefix)
export const publicApi = createAxiosInstance(BASE_URL);

// Tenant-scoped API (reads subdomain from localStorage for header)
export const api = createAxiosInstance(BASE_URL);
