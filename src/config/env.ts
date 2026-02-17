import axios from "axios";

export const ENV = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true
});