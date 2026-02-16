import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";

export default function Settings() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Configuración del Sistema"
                subtitle="Ajustes generales de la plataforma"
            />
            <div className="bg-card rounded-2xl p-6 border-border border shadow-sm h-96 flex items-center justify-center text-muted-foreground">
                Módulo de Configuración en construcción
            </div>
        </div>
    );
}
