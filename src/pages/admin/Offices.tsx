import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";

export default function Offices() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Oficinas"
                subtitle="Administra sucursales y puntos de entrega"
            />
            <div className="bg-card rounded-2xl p-6 border-border border shadow-sm h-96 flex items-center justify-center text-muted-foreground">
                Módulo de Oficinas en construcción
            </div>
        </div>
    );
}
