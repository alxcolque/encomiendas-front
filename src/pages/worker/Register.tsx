import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";

export default function RegisterShipment() {
    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Registrar Envío"
                subtitle="Registra una nueva encomienda en el sistema"
                actions={<NewShipmentModal />}
            />
        </div>
    );
}
