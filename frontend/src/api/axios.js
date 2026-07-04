import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the right token depending on whether this is a user or admin session
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  if (config.url?.startsWith("/admin") && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
});

export default api;
