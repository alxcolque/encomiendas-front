import HeroCarousel from "@/components/landing/HeroCarousel";
import { useSettingsStore } from "@/stores/settingsStore";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import ServicesGrid from "@/components/landing/ServicesGrid";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default function LandingPage() {
  const { general } = useSettingsStore();
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section with Carousel (Widget Removed) */}
      <section className="relative">
        <HeroCarousel />
      </section>
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
      {/* Floating Elements */}
      <FloatingWhatsApp />
    </div>);
}
