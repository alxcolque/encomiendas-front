import { Route } from "react-router-dom";
import DriverHomePage from "@/pages/driver/Home";
import ActiveDeliveryPage from "@/pages/driver/ActiveDelivery";

export const DriverRoutes = (
    <>
        <Route path="/driver" element={<DriverHomePage />} />
        <Route path="/driver/active" element={<ActiveDeliveryPage />} />
    </>
);
