import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import slider1 from "/slides/slider-1.webp";
import slider2 from "/slides/slider-2.webp";
import slider3 from "/slides/slider-3.webp";
import slider4 from "/slides/slider-4.webp";

const slides = [
  {
    image: slider1,
    title: "Envíos Nacionales en 24 Horas",
    subtitle: "Llegamos a cada rincón del país con seguridad garantizada",
  },
  {
    image: slider2,
    title: "Soluciones para E-commerce",
    subtitle: "Integra tu tienda y automatiza tus despachos hoy mismo",
  },
  {
    image: slider3,
    title: "Rastreo Satelital en Tiempo Real",
    subtitle: "Transparencia total desde la recolección hasta la entrega",
  },
  {
    image: slider4,
    title: "Atención Personalizada 24/7",
    subtitle: "Estamos contigo en cada paso de tu envío",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden bg-background rounded-xl">
      {/* Invisible template image to maintain aspect ratio based on the actual image */}
      <img
        src={slides[0].image}
        className="w-full h-auto opacity-0 block"
        aria-hidden="true"
        alt=""
      />

      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-contain"
            />
            {/* Content (Removed text overlays as requested) */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Smaller on mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/30 backdrop-blur-md hover:bg-background/80 transition-colors z-10"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/30 backdrop-blur-md hover:bg-background/80 transition-colors z-10"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
      </button>

      {/* Dots - Bottom Adjusted */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-primary w-6 md:w-8"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
