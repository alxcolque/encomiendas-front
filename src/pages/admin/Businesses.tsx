import { AdminSectionHeader } from '@/components/admin/shared/AdminSectionHeader';
import { BusinessesTable } from '@/components/admin/businesses/BusinessesTable';

export default function Businesses() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Empresas"
                subtitle="Administra las empresas clientes del sistema"
            />

            <BusinessesTable />
        </div>
    );
}
