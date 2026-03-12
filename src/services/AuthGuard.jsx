import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AuthGuard() {
    const { isAuth, role, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading....</div>;
    if (!isAuth) return <Navigate to="/login" replace />;

    const path = (location.pathname || "").toLowerCase();
    const startsWith = (prefix) => path === prefix || path.startsWith(prefix + "/");

    if (role === "ADMIN") {
        return <Outlet />;
    }

    if (role === "OPERATOR") {
        if (startsWith("/pos")) return <Outlet />;
        return <Navigate to="/pos" replace />;
    }

    if (role === "STORE_KEEPER") {
        if (startsWith("/inventory")) return <Outlet />;
        return <Navigate to="/inventory" replace />;
    }

    return <Navigate to="/login" replace />;
}
