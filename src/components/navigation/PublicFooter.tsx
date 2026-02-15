import { Link } from "react-router-dom";
import { Package, Facebook, Instagram, Twitter, Linkedin, CreditCard, Wallet, Banknote, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
    services: [
        { name: "Envíos Nacionales", href: "/services#nacionales" },
        { name: "Servicio Express", href: "/services#express" },
        { name: "Carga Corporativa", href: "/services#corporativo" },
        { name: "Rastreo Satelital", href: "/tracking" },
    ],
    company: [
        { name: "Nosotros", href: "/about" },
        { name: "Nuestras Oficinas", href: "/offices" },
        { name: "Contactar a Ventas", href: "/contact" },
    ],
    support: [
        { name: "Preguntas Frecuentes", href: "/faq" },
        { name: "Centro de Ayuda", href: "/contact" },
        { name: "Libro de Reclamaciones", href: "/claims" },
        { name: "Estado de mi envío", href: "/tracking" },
    ],
    legal: [
        { name: "Términos y Condiciones", href: "/terms" },
        { name: "Política de Privacidad", href: "/privacy" },
        { name: "Política de Reembolsos", href: "/refunds" },
    ]
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const paymentMethods = [
    { icon: CreditCard, label: "Tarjetas" },
    { icon: Wallet, label: "QR" },
    { icon: Banknote, label: "Efectivo" },
];

export default function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card/50 border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                                <Package className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold font-display text-foreground">KOLMOX</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm">
                            Revolucionando la logística en Bolivia. Conectamos personas y negocios con entregas rápidas, seguras y tecnología de punta.
                        </p>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Av. 6 de Agosto, Oruro, Bolivia</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+591 2 5252525</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>contacto@kolmox.com</span>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
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
                    <div className="lg:hidden col-span-1 flex flex-col items-center gap-4 text-center">
                        <h3 className="text-lg font-bold text-orange-600">Síguenos</h3>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <div className="flex gap-4 pt-2 text-[10px] text-gray-400">
                            <span>Facebook</span>
                            <span>Twitter</span>
                            <span>TikTok</span>
                            <span>YouTube</span>
                            <span>Instagram</span>
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

                        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg">
                            <span className="text-xs font-medium text-muted-foreground">Aceptamos:</span>
                            <div className="flex gap-2">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.label}
                                        className="text-muted-foreground/80 hover:text-foreground transition-colors"
                                        title={method.label}
                                    >
                                        <method.icon className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
