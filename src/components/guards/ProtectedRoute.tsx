import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, UserRole } from "@/stores/authStore";

interface ProtectedRouteProps {
    children?: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
    children,
    allowedRoles,
}: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to a default page based on their actual role or just home
        // For now, let's redirect to home which might redirect again or show landing
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
