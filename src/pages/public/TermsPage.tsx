import { useSettingsStore } from "@/stores/settingsStore";
import { useEffect } from "react";

export default function TermsPage() {
    const { termsAndConditions, fetchPublicSettings, isLoading } = useSettingsStore();

    useEffect(() => {
        fetchPublicSettings();
    }, []);

    return (
        <div className="container py-12 max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-display">Términos y Condiciones</h1>
            
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: termsAndConditions || '<p>No hay términos y condiciones configurados.</p>' }}
                />
            )}
        </div>
    );
}
