import HeroCarousel from "@/components/landing/HeroCarousel";
import QuoteTrackWidget from "@/components/landing/QuoteTrackWidget";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import ServicesGrid from "@/components/landing/ServicesGrid";
import BusinessSection from "@/components/landing/BusinessSection";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section with Carousel & Overlapping Widget */}
      <section className="relative">
        <HeroCarousel />

        {/* Desktop Overlapping Widget */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 z-20">
          <div className="max-w-7xl mx-auto flex justify-end">
            <QuoteTrackWidget />
          </div>
        </div>
      </section>

      {/* Mobile/Tablet Widget (Below Carousel) */}
      <div className="lg:hidden px-4 -mt-8 relative z-20">
        <QuoteTrackWidget />
      </div>

      {/* Quick Services Links (The 5 circular icons) */}
      <div className="lg:mt-32">
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
