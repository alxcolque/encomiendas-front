import { useState } from "react";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { OfficesTable } from "@/components/admin/offices/OfficesTable";
import { OfficeModal } from "@/components/admin/offices/OfficeModal";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Office } from "@/interfaces/office.interface";

export default function Offices() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

    const handleCreate = () => {
        setSelectedOffice(null);
        setIsModalOpen(true);
    };

    const handleEdit = (office: Office) => {
        setSelectedOffice(office);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Gestión de Agencias"
                subtitle="Administra sucursales y puntos de entrega"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    >
                        <Building2 className="mr-2 h-4 w-4" />
                        Nueva Agencia
                    </Button>
                }
            />

            <OfficesTable onEdit={handleEdit} />

            <OfficeModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                officeToEdit={selectedOffice}
            />
        </div>
    );
}
