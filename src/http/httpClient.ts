import { decryptAuthData } from "@/lib/helper";
import axios from "axios";
import { toast } from "sonner";
import store from "@/redux/store/store";
import { logoutAction } from "@/redux/auth/authSlice";

const baseURL = import.meta.env.VITE_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("creator");
      if (!stored || stored.trim() === "") return config;
      const user = decryptAuthData(stored);
      if (!user) {
        localStorage.removeItem("creator");
        return config;
      }
      const token = user?.token?.access;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("creator");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      store.dispatch(logoutAction());
      toast.error(
        error?.response?.data?.message || "Session expired. Please log in again."
      );
      setTimeout(() => {
        isLoggingOut = false;
        window.location.href = "/creator-portal/login";
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;