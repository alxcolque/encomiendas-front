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
      {/* Header with dynamic logo and site name */}
      <header className="flex items-center justify-center py-8">
        {general.logo && (
          <img src={general.logo} alt={general.siteName} className="h-12 w-auto mr-4" />
        )}
        <h1 className="text-3xl font-bold">{general.siteName}</h1>
      </header>
      {/* Hero Section with Carousel (Widget Removed) */}
      <section className="relative">
        <HeroCarousel />
      </section>
      {/* Quick Services Links (The 5 circular icons) */}
      <div className="mt-8 lg:mt-12">
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
