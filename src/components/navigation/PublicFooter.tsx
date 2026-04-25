import { useSettingsStore } from "@/stores/settingsStore";
import { Link } from "react-router-dom";
import { Package, Facebook, Instagram, Twitter, Linkedin, CreditCard, Wallet, Banknote, Mail, Phone, MapPin, Video, MessageCircle } from "lucide-react";

export default function PublicFooter() {
    const currentYear = new Date().getFullYear();
    const { general, socials, footerLinks } = useSettingsStore();

    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'facebook': return Facebook;
            case 'instagram': return Instagram;
            case 'twitter': return Twitter;
            case 'linkedin': return Linkedin;
            case 'tiktok': return Video;
            case 'whatsapp': return MessageCircle;
            default: return Package;
        }
    };


    return (
        <footer className="bg-card/50 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                                <img
                                    src={'logo.png'}
                                    alt={general.siteName || "KOLMOX"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'logo.png';
                                    }}
                                />
                            </div>
                            <span className="text-xl font-bold font-display text-foreground">{general.siteName}</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm">
                            {general.siteDescription}
                        </p>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{general.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>{general.supportPhone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>{general.supportEmail}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            {socials.filter(s => s.active).map((social) => {
                                const Icon = getSocialIcon(social.platform);
                                return (
                                    <a
                                        key={social.platform}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                        aria-label={social.platform}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Sections - Desktop Only */}
                    <div className="hidden lg:grid lg:col-span-8 grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-semibold text-foreground mb-6">Servicios</h3>
                            <ul className="space-y-4">
                                {footerLinks.services.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground mb-6">Empresa</h3>
                            <ul className="space-y-4">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground mb-6">Soporte</h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Mobile Siguenos Section (Matches Design) */}
                    <div className="lg:hidden col-span-1 flex flex-col items-center gap-6 py-8 border-t border-border mt-8">
                        <h3 className="text-xl font-black text-primary uppercase tracking-widest">Síguenos</h3>
                        <div className="flex gap-4">
                            {socials.filter(s => s.active).map((social) => {
                                const Icon = getSocialIcon(social.platform);
                                return (
                                    <a
                                        key={social.platform}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                                        aria-label={social.platform}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-16 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            © {currentYear} KOLMOX S.R.L. Todos los derechos reservados.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
