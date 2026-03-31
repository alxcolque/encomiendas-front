import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";

export default function FloatingWhatsApp() {
    const { general } = useSettingsStore();
    const whatsappNumber = general.supportPhone?.replace(/\D/g, '') || "59170000000";
    const message = "Hola Kolmox, necesito información sobre sus servicios.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.div
            drag
            dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[60] cursor-grab active:cursor-grabbing"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-shadow hover:shadow-[0_0_20px_rgba(37,211,102,0.6)]"
            >
                {/* Icon whatsapp svg */}
                <svg data-name="Layer 1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><defs><style></style><linearGradient gradientUnits="userSpaceOnUse" id="linear-gradient" x1="13.751" x2="500.246" y1="497.552" y2="11.057"><stop offset="0" stop-color="#209142" /><stop offset="1" stop-color="#56d263" /></linearGradient><linearGradient id="linear-gradient-2" x1="14.1" x2="500.595" y1="497.9" y2="11.405" /></defs><title /><path d="M263,127.88a120.44,120.44,0,0,0-99.7,188l-11.769,45.405,47.321-11.041A120.432,120.432,0,1,0,263,127.88Zm59.22,186.186c-16.845,7.9-52.014,3.778-89.065-27.93S186.6,220.316,191.8,202.454s25.63-21.162,29.484-20.309,23.126,31.406,20.5,34.97-15.311,16.25-15.311,16.25-.534,12.98,23.284,33.364,36.56,17.851,36.56,17.851,10.574-14.5,13.689-17.639,36.28,11.181,37.718,14.857S339.059,306.169,322.215,314.066Z" /><path d="M256,0C114.615,0,0,114.615,0,256S114.615,512,256,512,512,397.385,512,256,397.385,0,256,0Zm7,393.951a144.986,144.986,0,0,1-68.86-17.282L116.7,396l19.615-75.8A145.656,145.656,0,1,1,263,393.951Z" /></svg>

            </a>
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366] border-2 border-white"></span>
            </div>
        </motion.div>
    );
}
