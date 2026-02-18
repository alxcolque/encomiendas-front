import { create } from 'zustand';

interface GeneralSettings {
    siteName: string;
    siteDescription: string;
    keywords: string;
    supportEmail: string;
    supportPhone: string;
    address: string;
}

interface SocialLink {
    platform: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';
    url: string;
    active: boolean;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface PaymentMethod {
    id: string;
    icon: 'credit-card' | 'wallet' | 'banknote';
    label: string;
}

interface SettingsState {
    general: GeneralSettings;
    socials: SocialLink[];
    faqs: FAQItem[];
    footerLinks: {
        services: FooterLink[];
        company: FooterLink[];
        support: FooterLink[];
        legal: FooterLink[];
    };
    paymentMethods: PaymentMethod[];
    termsAndConditions: string;
    privacyPolicy: string;
    isLoading: boolean;
    updateGeneral: (settings: Partial<GeneralSettings>) => Promise<void>;
    updateSocials: (socials: SocialLink[]) => Promise<void>;
    updateFaqs: (faqs: FAQItem[]) => Promise<void>;
    updateFooterLinks: (footerLinks: any) => Promise<void>;
    updatePaymentMethods: (methods: PaymentMethod[]) => Promise<void>;
    updateLegal: (type: 'terms' | 'privacy', content: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    general: {
        siteName: 'Kolmox',
        siteDescription: 'Servicio de transporte de encomiendas rápido y seguro a nivel nacional.',
        keywords: 'encomiendas, transporte, bolivia, envios, paqueteria',
        supportEmail: 'soporte@kolmox.com',
        supportPhone: '+591 2 5200000',
        address: 'Calle Bolívar #123, Oruro, Bolivia'
    },
    socials: [
        { platform: 'facebook', url: 'https://facebook.com/kolmox', active: true },
        { platform: 'instagram', url: 'https://instagram.com/kolmox', active: true },
        { platform: 'tiktok', url: 'https://tiktok.com/@kolmox', active: false },
        { platform: 'whatsapp', url: 'https://wa.me/59170000000', active: true },
    ],
    faqs: [
        { id: '1', question: '¿Cuánto tiempo tarda un envío?', answer: 'El tiempo de entrega depende del destino, generalmente entre 24 a 48 horas.' },
        { id: '2', question: '¿Cómo puedo rastrear mi paquete?', answer: 'Puede usar el código de guía en nuestra página de inicio.' },
    ],
    footerLinks: {
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
    },
    paymentMethods: [
        { id: '1', icon: 'credit-card', label: "Tarjetas" },
        { id: '2', icon: 'wallet', label: "QR" },
        { id: '3', icon: 'banknote', label: "Efectivo" },
    ],
    termsAndConditions: 'Términos y condiciones de uso del servicio...',
    privacyPolicy: 'Política de privacidad y manejo de datos...',
    isLoading: false,

    updateGeneral: async (settings) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({ general: { ...state.general, ...settings }, isLoading: false }));
        }, 500);
    },
    updateSocials: async (socials) => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ socials, isLoading: false });
        }, 500);
    },
    updateFaqs: async (faqs) => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ faqs, isLoading: false });
        }, 500);
    },
    updateFooterLinks: async (footerLinks) => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ footerLinks, isLoading: false });
        }, 500);
    },
    updatePaymentMethods: async (methods) => {
        set({ isLoading: true });
        setTimeout(() => {
            set({ paymentMethods: methods, isLoading: false });
        }, 500);
    },
    updateLegal: async (type, content) => {
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                [type === 'terms' ? 'termsAndConditions' : 'privacyPolicy']: content,
                isLoading: false
            }));
        }, 500);
    },
}));
