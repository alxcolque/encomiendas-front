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
                <MessageCircle className="h-8 w-8 fill-current" />
            </a>
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366] border-2 border-white"></span>
            </div>
        </motion.div>
    );
}
