import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5001";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Attach access token
httpClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic refresh flow
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = window.localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push(() => {
            httpClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken as string;
        window.localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        pendingRequests.forEach((cb) => cb());
        pendingRequests = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        pendingRequests = [];
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("user");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
