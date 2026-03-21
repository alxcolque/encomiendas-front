import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/interfaces/auth.interface';
import { LoadingLogo } from "@/components/shared/LoadingLogo";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { authStatus, user, isLoading } = useAuthStore();
    const location = useLocation();
    const isAuthenticated = authStatus === 'auth';

    // Wait for Zustand persist to finish rehydrating from localStorage
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        // useAuthStore.persist is available when using the persist middleware
        const unsub = (useAuthStore as any).persist?.onFinishHydration(() => {
            setHydrated(true);
        });
        // If already hydrated (e.g. subsequent renders), check immediately
        const isAlreadyHydrated = (useAuthStore as any).persist?.hasHydrated?.();
        if (isAlreadyHydrated) setHydrated(true);
        return () => unsub?.();
    }, []);

    if (!hydrated || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingLogo className="w-8 h-8 animate-pulse text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user) {
        const userRole = user.role?.toLowerCase();
        const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

        if (!isAllowed) {
            console.warn(`[ProtectedRoute] Role mismatch: actual="${user.role}", allowed=${JSON.stringify(allowedRoles)}`);
            return <Navigate to="/" replace />;
        }
    }

    return children ? <>{children}</> : <Outlet />;
};

