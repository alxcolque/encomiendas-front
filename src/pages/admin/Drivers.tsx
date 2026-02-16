import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";

export default function Drivers() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Conductores"
                subtitle="Administra la flota de conductores activos"
            />
            <div className="bg-card rounded-2xl p-6 border-border border shadow-sm h-96 flex items-center justify-center text-muted-foreground">
                Módulo de Conductores en construcción
            </div>
        </div>
    );
}
