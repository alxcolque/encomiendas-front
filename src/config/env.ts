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

// Response interceptor for handling token expiration
ENV.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid infinite loop for login or refresh itself
            if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Try to refresh the token
                // We use base axios to avoid circular deps or infinite loops
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.accessToken;

                // Update localStorage so the next requests have it
                const storage = localStorage.getItem("auth-store");
                if (storage) {
                    const parsed = JSON.parse(storage);
                    if (parsed.state) {
                        parsed.state.token = newToken;
                        parsed.state.user = data.user;
                        localStorage.setItem("auth-store", JSON.stringify(parsed));
                    }
                }

                // Update original request header
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Retry original request with the main instance
                return ENV(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear auth and redirect
                localStorage.removeItem("auth-store");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);