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

export default function LandingPage() {
  const { general } = useSettingsStore();
  const { user, authStatus } = useAuthStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        {/* Hero Section with Carousel (Widget Removed) */}
        <section className="relative mt-4 lg:mt-0">
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

      {/* Floating Elements */}
      <FloatingWhatsApp />
    </div>
  );
}
