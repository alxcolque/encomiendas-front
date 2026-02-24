import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";
import Cities from "@/pages/admin/Cities";

export const AdminRoutes = (
    <>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cities" element={<Cities />} />
    </>
);
