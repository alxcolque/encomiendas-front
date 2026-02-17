import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { DriversTable } from "@/components/admin/drivers/DriversTable";
import { NewDriverModal } from "@/components/admin/drivers/NewDriverModal";

export default function Drivers() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Conductores"
                subtitle="Administra la flota de conductores activos"
                actions={<NewDriverModal />}
            />

            <DriversTable />
        </div>
    );
}
