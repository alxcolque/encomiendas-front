import HeroCarousel from "@/components/landing/HeroCarousel";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import ServicesGrid from "@/components/landing/ServicesGrid";
import BusinessSection from "@/components/landing/BusinessSection";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

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
        <BusinessSection />

        <TrustBar />

        <AboutSection />

        <ContactSection />
      </div>

      {/* Floating Elements */}
      <FloatingWhatsApp />
    </div>
  );
}
