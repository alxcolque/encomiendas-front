import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";

export default function Reports() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Reportes y Analíticas"
                subtitle="Visualiza el rendimiento del sistema"
            />
            <div className="bg-card rounded-2xl p-6 border-border border shadow-sm h-96 flex items-center justify-center text-muted-foreground">
                Módulo de Reportes en construcción
            </div>
        </div>
    );
}
