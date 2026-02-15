import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./public.routes";
import { DriverRoutes } from "./driver.routes";
import { AdminRoutes } from "./admin.routes";
import { WorkerRoutes } from "./worker.routes";
import { SharedRoutes } from "./shared.routes";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                {PublicRoutes}
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                {DriverRoutes}
                {AdminRoutes}
                {WorkerRoutes}
                {SharedRoutes}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
