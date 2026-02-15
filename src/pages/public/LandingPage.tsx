// import LandingNavbar from "@/components/landing/LandingNavbar"; // Removed: managed by PublicLayout
import HeroCarousel from "@/components/landing/HeroCarousel";
import QuoteTrackWidget from "@/components/landing/QuoteTrackWidget";
import TrustBar from "@/components/landing/TrustBar";
import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import MobileHero from "@/components/landing/MobileHero";
import MobileSubNav from "@/components/landing/MobileSubNav";
import ServicesGrid from "@/components/landing/ServicesGrid";
import MobileInfoSection from "@/components/landing/MobileInfoSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background pb-12">

      {/* DESKTOP VIEW (Visible lg and up) */}
      <div className="hidden lg:block">
        <section className="relative">
          <HeroCarousel />
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 z-20">
            <div className="max-w-7xl mx-auto flex justify-end">
              <QuoteTrackWidget />
            </div>
          </div>
        </section>
        <div className="h-32" />
        <TrustBar />
        <AboutSection />
        <ContactSection />
      </div>

      {/* MOBILE/TABLET VIEW (Hidden on lg) */}
      <div className="block lg:hidden">
        {/* Sticky Sub-Nav */}
        <MobileSubNav />

        {/* Desktop Carousel reused for Mobile */}
        <HeroCarousel />

        <ServicesGrid />

        <MobileInfoSection />

        {/* Social Footer is handled in PublicLayout, but we might want to ensure it matches the "Follow Us" style at the bottom of the design */}
      </div>

    </div>
  );
}
