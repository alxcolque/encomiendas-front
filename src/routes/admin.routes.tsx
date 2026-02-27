import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import Cities from "@/pages/admin/Cities";
import Clients from "@/pages/admin/Clients";
import Shipments from "@/pages/admin/Shipments";
import ShipmentDetails from "@/pages/admin/ShipmentDetails";
import InvoicePage from "@/pages/shared/InvoicePage";

export const AdminRoutes = (
    <>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<Clients />} />
        <Route path="/admin/cities" element={<Cities />} />
        <Route path="/admin/shipments" element={<Shipments />} />
        <Route path="/admin/shipments/:id" element={<ShipmentDetails />} />
    </>
);
