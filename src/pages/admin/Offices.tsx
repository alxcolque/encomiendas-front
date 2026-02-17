import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { OfficesTable } from "@/components/admin/offices/OfficesTable";
import { NewOfficeModal } from "@/components/admin/offices/NewOfficeModal";

export default function Offices() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Oficinas"
                subtitle="Administra sucursales y puntos de entrega"
                actions={<NewOfficeModal />}
            />

            <OfficesTable />
        </div>
    );
}
