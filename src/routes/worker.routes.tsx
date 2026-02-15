import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";

// Worker routes - simplified for now as per App.tsx fallback
export const WorkerRoutes = (
    <>
        <Route path="/worker" element={<AdminDashboard />} />
    </>
);
