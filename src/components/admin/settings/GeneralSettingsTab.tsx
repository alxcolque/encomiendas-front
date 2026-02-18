import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useEffect } from "react";

export function GeneralSettingsTab() {
    const { general, updateGeneral, isLoading } = useSettingsStore();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: general
    });

    useEffect(() => {
        reset(general);
    }, [general, reset]);

    const onSubmit = (data: any) => {
        updateGeneral(data).then(() => toast.success("Configuración general guardada"));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="siteName">Nombre del Sitio</Label>
                <Input id="siteName" {...register("siteName")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="siteDescription">Descripción (SEO)</Label>
                <Textarea id="siteDescription" {...register("siteDescription")} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="keywords">Palabras Clave (Separadas por comas)</Label>
                <Input id="keywords" {...register("keywords")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="supportEmail">Email de Soporte</Label>
                    <Input id="supportEmail" {...register("supportEmail")} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="supportPhone">Teléfono de Soporte</Label>
                    <Input id="supportPhone" {...register("supportPhone")} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Dirección Principal</Label>
                <Input id="address" {...register("address")} />
            </div>
            <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
            </Button>
        </form>
    );
}
