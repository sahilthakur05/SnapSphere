import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach token from localStorage as Authorization header (for cross-domain)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap backend { success, message, data } wrapper
api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object" && "success" in res.data && "data" in res.data) {
      res.data = res.data.data;
    }
    return res;
  },
  async (error) => {
    // Let Redux handle 401s — don't force-redirect or infinite-loop
    return Promise.reject(error);
  },
);

export default api;
