import axios from "axios";

// ------------------------------------------
// 🔵 BASE CONFIG
// ------------------------------------------
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 sec timeout (best practice)
});

// ------------------------------------------
// 🔵 REQUEST INTERCEPTOR (Attach JWT)
// ------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------
// 🔴 RESPONSE INTERCEPTOR (Global Error Handler)
// ------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    console.error("🔥 API Error:", message || error);

    // --------------------------------------
    // 🔥 TOKEN EXPIRED → AUTO LOGOUT
    // --------------------------------------
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      window.location.href = "/";
    }

    // --------------------------------------
    // 🔥 Forbidden Access → Redirect to home
    // --------------------------------------
    if (status === 403) {
      console.warn("⚠️ Unauthorized access");
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------
// 🟢 EXPORT CLEAN API WRAPPER (Recommended)
// ------------------------------------------
const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export default api;
