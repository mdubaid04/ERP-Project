import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://127.0.0.1:4000/api/v1/auth/refresh-access-token",
          {},
          { withCredentials: true },
        );
        return api.request(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event("unauthorized"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default api;
