import { ENV } from '../config/env';
import { toast } from 'sonner';
import { create } from 'zustand';

interface GeneralSettings {
    siteName: string;
    siteDescription: string;
    keywords: string;
    supportEmail: string;
    supportPhone: string;
    address: string;
    logo?: string | null;
    favicon?: string | null;
}

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    active: boolean;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order: number;
    active: boolean;
}

interface FooterLink {
    id: number;
    name: string;
    href: string;
    order: number;
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
    termsAndConditions: string;
    privacyPolicy: string;
    isLoading: boolean;
    fetchSettings: () => Promise<void>;
    updateGeneral: (settings: Partial<GeneralSettings>) => Promise<void>;
    updateSocials: (socials: SocialLink[]) => Promise<void>;
    updateFaqs: (faqs: FAQItem[]) => Promise<void>;
    updateFooterLinks: (footerLinks: any) => Promise<void>;
    updateLegal: (type: 'terms' | 'privacy', content: string) => Promise<void>;
    uploadLogo: (file: File, type: 'logo' | 'favicon') => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({

    general: {
        siteName: '',
        siteDescription: '',
        keywords: '',
        supportEmail: '',
        supportPhone: '',
        address: '',
    },
    socials: [],
    faqs: [],
    footerLinks: {
        services: [],
        company: [],
        support: [],
        legal: [],
    },
    termsAndConditions: '',
    privacyPolicy: '',
    isLoading: false,

    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const response = await ENV.get<any>('/admin/settings');
            const data = response.data;
            set({
                general: data.general,
                socials: data.socials,
                faqs: data.faqs,
                footerLinks: data.footerLinks,
                termsAndConditions: data.termsAndConditions,
                privacyPolicy: data.privacyPolicy,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            set({ isLoading: false });
        }
    },
    updateGeneral: async (settings) => {
        set({ isLoading: true });
        try {
            const payload = {
                site_name: settings.siteName,
                site_description: settings.siteDescription,
                keywords: settings.keywords,
                support_email: settings.supportEmail,
                support_phone: settings.supportPhone,
                address: settings.address,
            };
            const response = await ENV.put<any>('/admin/settings/general', payload);
            set((state) => ({ general: { ...state.general, ...response.data.data }, isLoading: false }));
            toast.success('Configuración general actualizada');
        } catch (error) {
            console.error('Error updating general settings:', error);
            set({ isLoading: false });
            toast.error('Error al actualizar configuración');
        }
    },
    updateSocials: async (socials) => {
        set({ isLoading: true });
        try {
            const response = await ENV.put<any>('/admin/settings/socials', { socials });
            set({ socials: response.data.data, isLoading: false });
            toast.success('Redes sociales actualizadas');
        } catch (error) {
            console.error('Error updating socials:', error);
            set({ isLoading: false });
            toast.error('Error al actualizar redes sociales');
        }
    },
    updateFaqs: async (faqs) => {
        set({ isLoading: true });
        try {
            const response = await ENV.put<any>('/admin/settings/faqs', { faqs });
            set({ faqs: response.data.data, isLoading: false });
            toast.success('FAQs actualizadas');
        } catch (error) {
            console.error('Error updating FAQs:', error);
            set({ isLoading: false });
            toast.error('Error al actualizar FAQs');
        }
    },
    updateFooterLinks: async (footerLinks) => {
        set({ isLoading: true });
        try {
            const response = await ENV.put<any>('/admin/settings/footer-links', { footerLinks });
            set({ footerLinks: response.data, isLoading: false });
            toast.success('Enlaces del pie de página actualizados');
        } catch (error) {
            console.error('Error updating footer links:', error);
            set({ isLoading: false });
            toast.error('Error al actualizar enlaces');
        }
    },
    updateLegal: async (type, content) => {
        set({ isLoading: true });
        try {
            const payload = {
                [type === 'terms' ? 'terms_and_conditions' : 'privacy_policy']: content
            };
            const response = await ENV.put<any>('/admin/settings/legal', payload);
            set({
                termsAndConditions: response.data.termsAndConditions,
                privacyPolicy: response.data.privacyPolicy,
                isLoading: false
            });
            toast.success('Información legal actualizada');
        } catch (error) {
            console.error('Error updating legal info:', error);
            set({ isLoading: false });
            toast.error('Error al actualizar información legal');
        }
    },
    uploadLogo: async (file: File, type: 'logo' | 'favicon') => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            formData.append('type', type);
            formData.append(type, file); // 'files' handling in backend

            // Explicitly unset Content-Type so browser sets boundary correctly
            // This overrides the default 'application/json' in ENV
            const response = await ENV.post<any>('/admin/settings/logo', formData, {
                headers: { 'Content-Type': undefined } // undefined allows browser to set multipart/form-data + boundary
            });

            set((state) => ({
                general: {
                    ...state.general,
                    logo: response.data.data.logo,
                    favicon: response.data.data.favicon
                },
                isLoading: false
            }));
            toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} actualizado`);
        } catch (error: any) {
            console.error(`Error uploading ${type}:`, error);
            if (error.response?.data) {
                console.error("Validation errors:", error.response.data);
                toast.error(`Error: ${error.response.data.message || 'Error de validación'}`);
            } else {
                set({ isLoading: false });
                toast.error(`Error al subir ${type}`);
            }
            set({ isLoading: false });
        }
    },
}));
