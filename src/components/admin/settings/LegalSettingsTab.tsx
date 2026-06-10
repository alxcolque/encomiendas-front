import { TiptapEditor } from "./TiptapEditor";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function LegalSettingsTab() {
    const { termsAndConditions, privacyPolicy, updateLegal, isLoading } = useSettingsStore();
    const [terms, setTerms] = useState(termsAndConditions);
    const [privacy, setPrivacy] = useState(privacyPolicy);

    useEffect(() => {
        setTerms(termsAndConditions);
    }, [termsAndConditions]);

    useEffect(() => {
        setPrivacy(privacyPolicy);
    }, [privacyPolicy]);

    const handleSave = () => {
        Promise.all([
            updateLegal('terms', terms),
            updateLegal('privacy', privacy)
        ]).then(() => toast.success("Documentos legales actualizados"));
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Términos y Condiciones</h3>
                <TiptapEditor
                    value={terms}
                    onChange={setTerms}
                    placeholder="Escriba los términos y condiciones aquí..."
                />
            </div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Política de Privacidad</h3>
                <TiptapEditor
                    value={privacy}
                    onChange={setPrivacy}
                    placeholder="Escriba la política de privacidad aquí..."
                />
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Guardar Documentos
            </Button>
        </div>
    );
}
