import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook to listen for auth-logout events from axios interceptor
 * Navigates to login page when token refresh fails
 */
export function useAuthLogoutListener() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthLogout = (event: Event) => {
            const customEvent = event as CustomEvent;
            const redirect = customEvent.detail?.redirect || "/login";
            console.log("[Auth] Redirecting to:", redirect);
            navigate(redirect, { replace: true });
        };

        window.addEventListener("auth-logout", handleAuthLogout);

        return () => {
            window.removeEventListener("auth-logout", handleAuthLogout);
        };
    }, [navigate]);
}
