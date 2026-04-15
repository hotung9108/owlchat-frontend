import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "USER" | "BUSINESS";
}

export function ProtectedRoute({
    children,
    requiredRole = "ADMIN",
}: ProtectedRouteProps) {
    const { loading, isAuthenticated, role } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // Check if user is authenticated (refreshToken exists)
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role for admin routes
    if (requiredRole === "ADMIN" && role !== "ADMIN") {
        return <Navigate to="/conversations" replace />;
    }

    return <>{children}</>;
}
