import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { NewUserModal } from "@/components/admin/users/NewUserModal";

export default function Users() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Usuarios"
                subtitle="Administra clientes y permisos"
                actions={<NewUserModal />}
            />

            <UsersTable />
        </div>
    );
}
