import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ThemeProvider } from "next-themes";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DriverHomePage from "./pages/DriverHomePage";
import ActiveDeliveryPage from "./pages/ActiveDeliveryPage";
import TrackingPage from "./pages/TrackingPage";
import RankingPage from "./pages/RankingPage";
import WalletPage from "./pages/WalletPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            
            {/* Driver Routes */}
            <Route path="/driver" element={
              <ProtectedRoute><DriverHomePage /></ProtectedRoute>
            } />
            <Route path="/driver/active" element={
              <ProtectedRoute><ActiveDeliveryPage /></ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/ranking" element={
              <ProtectedRoute><RankingPage /></ProtectedRoute>
            } />
            <Route path="/wallet" element={
              <ProtectedRoute><WalletPage /></ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            
            {/* Fallbacks */}
            <Route path="/worker" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><WalletPage /></ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
