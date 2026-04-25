import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";
import DriverLayout from "@/layouts/DriverLayout";
import AdminLayout from "@/layouts/AdminLayout";
import WorkerLayout from "@/layouts/WorkerLayout";
import UserLayout from "@/layouts/UserLayout";

// Lazy Pages
// Public
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const LoginPage = lazy(() => import("@/pages/public/LoginPage"));
const TrackingPage = lazy(() => import("@/pages/public/TrackingPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/public/ServicesPage"));
const OfficesPage = lazy(() => import("@/pages/public/OfficesPage"));
const FaqPage = lazy(() => import("@/pages/public/FaqPage"));
const TermsPage = lazy(() => import("@/pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage"));
const RefundPolicyPage = lazy(() => import("@/pages/public/RefundPolicyPage"));
const ClaimsPage = lazy(() => import("@/pages/public/ClaimsPage"));
const MyBusinessPage = lazy(() => import("@/pages/public/MyBusinessPage"));

// Driver
const DriverHome = lazy(() => import("@/pages/driver/Home"));
const ActiveDelivery = lazy(() => import("@/pages/driver/ActiveDelivery"));
const Ranking = lazy(() => import("@/pages/driver/Ranking"));
const Wallet = lazy(() => import("@/pages/driver/Wallet"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminShipments = lazy(() => import("@/pages/admin/Shipments"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminClients = lazy(() => import("@/pages/admin/Clients"));
const AdminDrivers = lazy(() => import("@/pages/admin/Drivers"));
const AdminOffices = lazy(() => import("@/pages/admin/Offices"));
const AdminCities = lazy(() => import("@/pages/admin/Cities"));
const AdminBusinesses = lazy(() => import("@/pages/admin/Businesses"));
const AdminReports = lazy(() => import("@/pages/admin/Reports"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const ShipmentDetails = lazy(() => import("@/pages/admin/ShipmentDetails"));
const ShipmentTicket = lazy(() => import("@/pages/admin/ShipmentTicket"));
const InvoicePage = lazy(() => import("@/pages/shared/InvoicePage"));
// User
const ProfilePage = lazy(() => import("@/pages/user/Profile"));
const DeleteAccountPage = lazy(() => import("@/pages/user/DeleteAccount"));
const ClientProfilePage = lazy(() => import("@/pages/client/ProfilePage"));


const Loading = () => <div className="loading-logo-full"></div>;

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/tracking" element={<TrackingPage />} />

                    {/* Informational */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/offices" element={<OfficesPage />} />
                    <Route path="/faq" element={<FaqPage />} />

                    {/* Legal */}
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/refunds" element={<RefundPolicyPage />} />
                    <Route path="/claims" element={<ClaimsPage />} />
                    <Route path="/my-business" element={<MyBusinessPage />} />
                </Route>

                {/* Driver Routes */}
                <Route element={<ProtectedRoute allowedRoles={['driver']}><DriverLayout /></ProtectedRoute>}>
                    <Route path="/driver" element={<DriverHome />} />
                    <Route path="/driver/active" element={<ActiveDelivery />} />
                    <Route path="/driver/ranking" element={<Ranking />} />
                    <Route path="/driver/wallet" element={<Wallet />} />
                </Route>

                {/* Admin/Staff Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'worker', 'company', 'partner']}><AdminLayout /></ProtectedRoute>}>
                    {/* Accessible by all staff (admin, worker, company, partner) */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/shipments" element={<AdminShipments />} />
                    <Route path="/admin/shipments/:id" element={<ShipmentDetails />} />

                    {/* Accessible by admin and worker */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'worker']} />}>
                        <Route path="/admin/clients" element={<AdminClients />} />
                        <Route path="/admin/reports" element={<AdminReports />} />
                    </Route>

                    {/* Accessible only by admin */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/drivers" element={<AdminDrivers />} />
                        <Route path="/admin/offices" element={<AdminOffices />} />
                        <Route path="/admin/cities" element={<AdminCities />} />
                        <Route path="/admin/businesses" element={<AdminBusinesses />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                    </Route>
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['admin', 'worker']}><ShipmentTicket /></ProtectedRoute>} path="/admin/ticket/:id" />

                {/* Worker Layout Fallback (if any old links remain) */}
                <Route element={<ProtectedRoute allowedRoles={['worker']}><Navigate to="/admin" replace /></ProtectedRoute>} path="/worker" />

                {/* User Routes */}
                <Route element={<ProtectedRoute allowedRoles={['client', 'driver', 'admin', 'worker']}><UserLayout /></ProtectedRoute>}>
                    <Route path="/user" element={<Navigate to="/user/profile" replace />} />
                    <Route path="/user/profile" element={<ProfilePage />} />
                    <Route path="/user/profile/delete-me" element={<DeleteAccountPage />} />
                    <Route path="/shipments/:id/invoice" element={<InvoicePage />} />
                </Route>

                {/* Global Profile Access */}
                {/* For non-client roles (Admin, Driver, Worker) */}
                <Route path="/profile" element={<ProtectedRoute allowedRoles={['driver', 'admin', 'worker']}><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<ProfilePage />} />
                </Route>

                {/* For client role */}
                <Route path="/me" element={<ProtectedRoute allowedRoles={['client']}><PublicLayout /></ProtectedRoute>}>
                    <Route index element={<ClientProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
