import { AdminSectionHeader } from '@/components/admin/shared/AdminSectionHeader';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { useClientStore } from '@/stores/clientStore';
import { useRegisterRefresh } from '@/stores/refreshStore';

export default function Clients() {
    const { fetchClients } = useClientStore();
    useRegisterRefresh(fetchClients);

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
