import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";
import { RecentShipmentsTable } from "@/components/admin/dashboard/RecentShipmentsTable"; // Reusing table for now

export default function Shipments() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Encomiendas"
                subtitle="Administra todos los envíos del sistema"
                actions={<NewShipmentModal />}
            />

            {/* We can reuse the RecentShipmentsTable or create a full table later */}
            <RecentShipmentsTable />
        </div>
    );
}
