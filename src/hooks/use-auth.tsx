import { useState, useEffect } from "react";
import { logout, login, refreshToken } from "../services/account-service";

// import type { LoginRequest, LoginResponse } from "../features/auth/types/auth.type";
import type { LoginRequest, LoginResponse } from "@/types/auth.type";
import type { AccountRole } from "@/types/enum/account-role";

export function useAuth() {
    const [role, setRole] = useState<AccountRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setRole(storedRole as AccountRole);
        }
        setLoading(false);
    }, []);

    const handleLogin = async (params: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await login(params);
            if (!response.status) {
                throw new Error(
                    "Your account has been locked. Please contact support.",
                );
            }
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("userRole", response.role);
            console.log(response.role);
            setRole(response.role);
            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            const refreshTokenValue = localStorage.getItem("refreshToken");
            if (refreshTokenValue) {
                await logout({ refreshToken: refreshTokenValue });
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");
            setRole(null);
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
                refreshToken: refreshTokenValue,
            });
            localStorage.setItem("accessToken", response.accessToken);
        } catch (error) {
            console.error("Token refresh failed:", error);
            throw error;
        }
    };

    const isAuthenticated = (): boolean => {
        return !!localStorage.getItem("refreshToken");
    };

    const getRole = (): AccountRole | null => {
        return role;
    };

    const isAdmin = (): boolean => {
        return role === "ADMIN";
    };

    return {
        role,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refreshToken: handleRefreshToken,
        isAuthenticated,
        getRole,
        isAdmin,
    };
}
