import { useState, useEffect } from "react";
import { logout, login, refreshToken } from "../services/accountService";

import type {
    LoginRequest,
    LoginResponse,
} from "../types/auth.type";
export function useAuth() {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = async (params: LoginRequest) => {
        try {
            const response = await login(params);
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("user", JSON.stringify(response));
            setUser(response);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await logout({ refreshToken });
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const handleRefreshToken = async () => {
        try {
            const refreshTokenValue = localStorage.getItem("refreshToken");
            if (!refreshTokenValue) throw new Error("No refresh token found");

            const response = await refreshToken({
                accessToken: refreshTokenValue,
            });
            localStorage.setItem("accessToken", response.accessToken);
        } catch (error) {
            console.error("Token refresh failed:", error);
            throw error;
        }
    };

    return {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refreshToken: handleRefreshToken,
    };
}
