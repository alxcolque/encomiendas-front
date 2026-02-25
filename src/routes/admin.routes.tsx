import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import Cities from "@/pages/admin/Cities";
import Clients from "@/pages/admin/Clients";

export const AdminRoutes = (
    <>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/cities" element={<Cities />} />
    </>
);
