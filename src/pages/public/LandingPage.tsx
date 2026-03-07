import HeroCarousel from "@/components/landing/HeroCarousel";
import { useSettingsStore } from "@/stores/settingsStore";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import ServicesGrid from "@/components/landing/ServicesGrid";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import ClientOrderHistory from "@/components/landing/ClientOrderHistory";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import LoginModal from "@/components/landing/LoginModal";

export default function LandingPage() {
  const { general } = useSettingsStore();
  const { user, authStatus } = useAuthStore();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        {/* Hero Section with Carousel (Widget Removed) */}
        <section className="relative">
          <HeroCarousel />
        </section>

        {/* Client Order History */}
        {authStatus === 'auth' && user?.role === 'client' && (
          <ClientOrderHistory />
        )}

        {/* Quick Services Links (The 5 circular icons) */}
        <div className="mt-4 lg:mt-6">
          <ServicesGrid />
        </div>
        {/* Main Content Sections Flow */}
        <div className="space-y-0">
          <TrustBar />
          <AboutSection />
          <ContactSection />
        </div>
      </main>

      {/* Footer Area with Admin Link */}
      <footer className="py-6 border-t border-border mt-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 flex justify-center text-sm">
          <button
            onClick={() => setAdminLoginOpen(true)}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            Administrar
          </button>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <LoginModal open={adminLoginOpen} onOpenChange={setAdminLoginOpen} />

      {/* Floating Elements */}
      <FloatingWhatsApp />
    </div>
  );
}
