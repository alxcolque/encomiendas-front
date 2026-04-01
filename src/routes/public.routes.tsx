import { Route } from "react-router-dom";
import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/public/LoginPage";
import TrackingPage from "@/pages/public/TrackingPage";
import MyBusinessPage from "../pages/public/MyBusinessPage";

export const PublicRoutes = (
    <>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/my-business" element={<MyBusinessPage />} />
    </>
);
