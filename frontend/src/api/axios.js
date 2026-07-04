import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
});

api.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (config.url && config.url.startsWith("/admin") && adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
});

export default api;