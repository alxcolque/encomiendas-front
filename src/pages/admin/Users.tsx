import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";


export default function Users() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Usuarios"
                subtitle="Administra clientes y permisos"
            />

            <UsersTable />
        </div>
    );
}
