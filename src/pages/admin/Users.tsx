import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";

export default function Users() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Usuarios"
                subtitle="Administra clientes y permisos"
            />
            <div className="bg-card rounded-2xl p-6 border-border border shadow-sm h-96 flex items-center justify-center text-muted-foreground">
                Módulo de Usuarios en construcción
            </div>
        </div>
    );
}
