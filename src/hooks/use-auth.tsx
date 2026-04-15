import { useState, useEffect } from "react";
import {
    logout,
    login,
    refreshToken,
} from "../services/account-service";

import { authService } from "@/services/account-service";

import type { LoginRequest, LoginResponse } from "@/types/auth.type";
import type {
    SignUpRequest,
    SignUpAuthenticateRequest,
} from "@/types/auth.type";
import type { AccountRole } from "@/types/enum/account-role";

export function useAuth() {
    const [role, setRole] = useState<AccountRole | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // store accountId temporarily for signup flow
    const [pendingAccountId, setPendingAccountId] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setRole(storedRole as AccountRole);
        }
        setLoading(false);
    }, []);

    // ========================
    // LOGIN
    // ========================
    const handleLogin = async (params: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await login(params);

            if (!response.status) {
                throw new Error(
                    "Your account has been locked. Please contact support."
                );
            }

            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("userRole", response.role);

            setRole(response.role);

            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // ========================
    // SIGNUP
    // ========================
    const handleSignup = async (payload: SignUpRequest) => {
        try {
            const response = await authService.signup(payload);

            // ⚠️ critical: backend should return accountId
            if (!response.accountId) {
                throw new Error("Missing accountId from signup response");
            }

            setPendingAccountId(response.accountId);

            return response;
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    // ========================
    // VERIFY SIGNUP (OTP / CODE)
    // ========================
    const handleAuthenticateSignup = async (
        payload: SignUpAuthenticateRequest
    ) => {
        try {
            if (!pendingAccountId) {
                throw new Error("No pending accountId found");
            }

            const response = await authService.authenticate(
                pendingAccountId,
                payload
            );

            // signup flow finished → clear temp state
            setPendingAccountId(null);

            return response;
        } catch (error) {
            console.error("Authentication failed:", error);
            throw error;
        }
    };

    // ========================
    // RESEND CODE
    // ========================
    const handleRenewCode = async () => {
        try {
            if (!pendingAccountId) {
                throw new Error("No pending accountId found");
            }

            return await authService.renewCode(pendingAccountId);
        } catch (error) {
            console.error("Renew code failed:", error);
            throw error;
        }
    };

    // ========================
    // LOGOUT
    // ========================
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

    // ========================
    // REFRESH TOKEN
    // ========================
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

    // ========================
    // HELPERS
    // ========================
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

        // auth
        login: handleLogin,
        logout: handleLogout,
        refreshToken: handleRefreshToken,

        // signup flow
        signup: handleSignup,
        authenticateSignup: handleAuthenticateSignup,
        renewCode: handleRenewCode,

        // state
        pendingAccountId,

        // helpers
        isAuthenticated,
        getRole,
        isAdmin,
    };
}