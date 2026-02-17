import axios from "axios";

export const ENV = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

// Circular dependency avoidance: read token from localStorage directly
ENV.interceptors.request.use(
    (config) => {
        try {
            const storage = localStorage.getItem("auth-store");
            if (storage) {
                const parsed = JSON.parse(storage);
                const token = parsed.state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);