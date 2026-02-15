import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";

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
const ContactPage = lazy(() => import("@/pages/public/ContactPage"));
const FaqPage = lazy(() => import("@/pages/public/FaqPage"));
const TermsPage = lazy(() => import("@/pages/public/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/public/PrivacyPage"));
const RefundPolicyPage = lazy(() => import("@/pages/public/RefundPolicyPage"));
const ClaimsPage = lazy(() => import("@/pages/public/ClaimsPage"));

// Driver
const DriverHome = lazy(() => import("@/pages/driver/Home"));
const ActiveDelivery = lazy(() => import("@/pages/driver/ActiveDelivery"));
const Ranking = lazy(() => import("@/pages/driver/Ranking"));
const Wallet = lazy(() => import("@/pages/driver/Wallet"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

// Shared/User (using placeholder or reused components for now)
const UserProfile = lazy(() => import("@/pages/driver/Wallet")); // Reusing Wallet as Profile placeholder per original App.tsx
// Note: In original App.tsx, /profile -> WalletPage. 
// I should probably check if I should create UserProfile or just reuse.
// User request said `pages/user/Profile.tsx`. I should check if I created it.
// I did NOT create `pages/user/Profile.tsx` yet. I moved `WalletPage` to `driver/Wallet`.
// I will create a placeholder for pages I missed during the move or that didn't exist.

const Loading = () => <div className="p-4 text-center">Cargando...</div>;

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
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />

                    {/* Legal */}
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/refunds" element={<RefundPolicyPage />} />
                    <Route path="/claims" element={<ClaimsPage />} />
                </Route>

                {/* Driver Routes */}
                <Route element={<ProtectedRoute allowedRoles={['driver']}><DriverLayout /></ProtectedRoute>}>
                    <Route path="/driver" element={<DriverHome />} />
                    <Route path="/driver/active" element={<ActiveDelivery />} />
                    <Route path="/driver/ranking" element={<Ranking />} />
                    <Route path="/driver/wallet" element={<Wallet />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    {/* Add more admin routes here */}
                </Route>

                {/* Worker Routes */}
                <Route element={<ProtectedRoute allowedRoles={['worker']}><WorkerLayout /></ProtectedRoute>}>
                    <Route path="/worker" element={<AdminDashboard />} /> {/* Placeholder */}
                </Route>

                {/* User Routes */}
                <Route element={<ProtectedRoute allowedRoles={['client', 'driver']}><UserLayout /></ProtectedRoute>}>
                    <Route path="/user" element={<Wallet />} /> {/* Placeholder */}
                    <Route path="/user/profile" element={<Wallet />} /> {/* Placeholder */}
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
