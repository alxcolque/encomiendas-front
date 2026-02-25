import { AdminSectionHeader } from '@/components/admin/shared/AdminSectionHeader';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';

export default function Clients() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Clientes"
                subtitle="Registra y administra los clientes del sistema"
            />

            <ClientsTable />
        </div>
    );
}
