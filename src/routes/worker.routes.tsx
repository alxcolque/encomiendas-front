import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";
import RegisterShipment from "@/pages/worker/Register";

export const WorkerRoutes = (
    <>
        <Route path="/worker" element={<AdminDashboard />} />
        <Route path="/worker/register" element={<RegisterShipment />} />
    </>
);
