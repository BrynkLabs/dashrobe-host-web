import axios from "axios";
import { setCookie, removeCookie } from "@/app/utils/cookieUtils";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const forceLogout = () => {
  const role = localStorage.getItem("role");

  removeCookie("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("userType");
  localStorage.removeItem("role");
  localStorage.removeItem("newUser");
  localStorage.removeItem("refreshToken");

  window.location.href = role === "VENDOR" ? "/vendor-login" : "/login";
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const resData = res.data;
        const tokenData = resData.data || resData;
        const newToken = tokenData.accessToken || tokenData.token;
        const newRefreshToken = tokenData.refreshToken;

        if (!newToken) {
          throw new Error("No token in refresh response");
        }

        setCookie("token", newToken, 1);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError: any) {
        const status = refreshError?.response?.status;
        const msg = refreshError?.response?.data?.message || refreshError?.message;
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
