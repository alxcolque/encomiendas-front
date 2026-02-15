import { Route } from "react-router-dom";
import DriverHomePage from "@/pages/DriverHomePage";
import ActiveDeliveryPage from "@/pages/ActiveDeliveryPage";

export const DriverRoutes = (
    <>
        <Route path="/driver" element={<DriverHomePage />} />
        <Route path="/driver/active" element={<ActiveDeliveryPage />} />
    </>
);
