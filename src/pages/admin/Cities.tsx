import { useState } from "react";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { CitiesTable } from "@/components/admin/cities/CitiesTable";
import { CityModal } from "@/components/admin/cities/CityModal";
import { RoutesTab } from "@/components/admin/cities/RoutesTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Route } from "lucide-react";
import { City } from "@/interfaces/city.interface";

export default function Cities() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const handleCreate = () => {
        setSelectedCity(null);
        setIsModalOpen(true);
    };

    const handleEdit = (city: City) => {
        setSelectedCity(city);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Ciudades y Rutas"
                subtitle="Gestiona las ciudades de cobertura y las tarifas por ruta"
            />

            <Tabs defaultValue="routes" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="routes" className="flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        Rutas
                    </TabsTrigger>
                    <TabsTrigger value="cities" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Ciudades
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="routes">
                    <RoutesTab />
                </TabsContent>

                <TabsContent value="cities">
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={handleCreate}
                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                Nueva Ciudad
                            </Button>
                        </div>

                        <CitiesTable onEdit={handleEdit} />
                    </div>
                </TabsContent>
            </Tabs>

            <CityModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                cityToEdit={selectedCity}
            />
        </div>
    );
}
