import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import slide1 from "@/assets/hero-slide-1.jpg"; // Using existing assets
import slide2 from "@/assets/hero-slide-2.jpg";

export default function MobileHero() {
    return (
        <div className="w-full bg-background pb-6">
            {/* Sub-navigation Strip */}
            <div className="sticky top-16 z-40 flex justify-around items-center py-3 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 transition-all">
                <Link to="/" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Inicio</span>
                </Link>

                <Link to="/services" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" x2="11" y1="2" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Envia</span>
                </Link>

                <Link to="/tracking" className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Rastreo</span>
                </Link>
            </div>

            {/* Hero Content - Van & Package */}
            <div className="relative mt-4 mx-4 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100 shadow-sm border border-orange-100 aspect-[16/9] flex items-center justify-center">

                {/* Carousel Content (Mocked static for now based on image) */}
                <div className="relative w-full h-full flex items-center justify-between px-2 sm:px-8 py-4">

                    {/* Van Image */}
                    <div className="w-3/5 h-full flex items-center justify-center z-10">
                        <img
                            src={slide1}
                            alt="Delivery Van"
                            className="object-contain w-full h-full drop-shadow-xl transform -scale-x-100" // Flip van to face right if needed, checking image
                        />
                    </div>

                    {/* Package Image */}
                    <div className="w-2/5 h-full flex items-center justify-center -ml-4 z-20">
                        <div className="relative w-32 h-24 bg-orange-400 rounded-lg shadow-2xl transform rotate-12 flex items-center justify-center border-4 border-white">
                            <span className="text-white font-bold text-xs tracking-widest bg-black/10 px-2 py-1 rounded">KOLMOX</span>
                        </div>
                    </div>

                    {/* Arrows */}
                    <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary rounded-full w-8 h-8 z-30">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-primary rounded-full w-8 h-8 z-30">
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
