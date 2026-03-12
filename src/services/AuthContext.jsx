import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext({
    isAuth: false,
    role: null,
    shop: null,
    loading: true,
    login: async () => { },
    refreshAuth: async () => { },
    user: null
});

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState(null);
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Set up Axios interceptor for token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, []);

    const refreshAuth = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuth(false);
            setRole(null);
            setShop(null);
            setLoading(false);
            return;
        }
        try {
            const user = await api.get("/auth/users/validate-user");
            setIsAuth(user?.data?.authorized || false);
            setRole(user?.data?.roleCode || null);
            setUser(user?.data?.userDetails || null);
            if (user?.data?.authorized) {
                const shopData = await api.get("/api/shops");
                setShop(shopData?.data || null);
            } else {
                setShop(null);
            }
        } catch (error) {
            setIsAuth(false);
            setRole(null);
            setShop(null);
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
           // AuthContext.jsx
const response = await api.post("/auth/users/login", credentials);
            const { token } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                await refreshAuth(); // Update auth state
                return { success: true };
            }
            setLoading(false);
            return { success: false, message: "No token received" };
        } catch (error) {
            setLoading(false);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/users/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        }
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsAuth(false);
        setRole(null);
        setShop(null);
        setLoading(false);
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, role, shop, loading, login, refreshAuth, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}