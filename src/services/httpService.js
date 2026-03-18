// import axios from "axios";

// const api = axios.create({
//     baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('jwt_token');
//         if (token) {
//             config.headers = config.headers || {};
//             config.headers.Authorization = token;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error?.response?.status === 401) {
//             console.log('unauthorized');
//             localStorage.removeItem('jwt_token');
//             window.location.replace('/login');
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from "axios";
import { jwtDecode } from 'jwt-decode';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
// });

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // const token = localStorage.getItem("token");
            const token = localStorage.getItem("jwt_token")?.replace(/^Bearer\s/, "");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        localStorage.removeItem("jwt_token");
                        if (window.location.pathname !== "/login") {
                            window.location.href = "/login";
                        }
                        return Promise.reject("Token expired");
                    }

                    config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                    console.error("Invalid token:", error);
                    localStorage.removeItem("jwt_token");
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("jwt_token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        if (error.response && error.response.status === 500) {
            console.error("Server Error:", error.response.data);
        }

        if (error.message === "Network Error") {
            console.error("Network Error: API server may be down");
        }
        return Promise.reject(error);
    }
);

export default api;
