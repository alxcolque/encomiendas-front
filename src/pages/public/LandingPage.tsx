// import LandingNavbar from "@/components/landing/LandingNavbar"; // Removed: managed by PublicLayout
import HeroCarousel from "@/components/landing/HeroCarousel";
import QuoteTrackWidget from "@/components/landing/QuoteTrackWidget";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
// import Footer from "@/components/landing/Footer"; // Removed: managed by PublicLayout

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* LandingNavbar removed */}

      {/* Hero Section with Carousel and Widget */}
      <section className="relative">
        <HeroCarousel />

        {/* Floating Widget - Desktop: overlays carousel, Mobile: below */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 z-20 hidden lg:block">
          <div className="max-w-7xl mx-auto flex justify-end">
            <QuoteTrackWidget />
          </div>
        </div>
      </section>

      {/* Mobile Widget */}
      <div className="lg:hidden px-4 py-8 -mt-8 relative z-20">
        <QuoteTrackWidget />
      </div>

      {/* Spacer for desktop widget overlap */}
      <div className="hidden lg:block h-32" />

      {/* Trust Bar */}
      <TrustBar />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer removed */}
      {/* <Footer /> */}
    </div>
  );
}
