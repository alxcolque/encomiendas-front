import axios from 'axios';
import { ENV } from '../config/env';

export const api = axios.create({
    baseURL: ENV.API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Avoid circular dependency by NOT importing store here directly if possible, 
            // or handle redirection at the router/component level. 
            // But typically strict 401 handling might need a global event or similar.
            // For now, we will just reject the promise and let components/store handle it.
            // OR we can check window.location to redirect if absolutely needed, but better to let AuthStore handle state.

            // Ideally, AuthStore should intercept this or we can dispatch a custom event.
            // For simplicity requested, we'll let the caller handle the error usually, 
            // but we could clear local state if we had any. 
            // Since we are HttpOnly, we don't have tokens to clear.
        }
        return Promise.reject(error);
    }
);
