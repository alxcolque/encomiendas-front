import { useEffect } from "react";
import { useCityStore } from "@/stores/cityStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin } from "lucide-react";
import { City } from "@/interfaces/city.interface";
import { toast } from "sonner";

interface CitiesTableProps {
    onEdit: (city: City) => void;
}

export function CitiesTable({ onEdit }: CitiesTableProps) {
    const { cities, isLoading, fetchCities, deleteCity } = useCityStore();

    useEffect(() => {
        fetchCities();
    }, []);

    const handleDelete = async (city: City) => {
        if (!confirm(`¿Eliminar la ciudad "${city.name}"? Esta acción no se puede deshacer.`))
            return;
        try {
            await deleteCity(city.id);
            toast.success("Ciudad eliminada correctamente");
        } catch (error: any) {
            toast.error("Error al eliminar ciudad", {
                description: error.response?.data?.message || "Ocurrió un error inesperado",
            });
        }
    };

    if (isLoading && cities.length === 0) {
        return <div className="loading-logo-section"></div>;
    }

    if (cities.length === 0) {
        return (
            <div className="p-10 text-center text-muted-foreground border rounded-xl border-dashed">
                <MapPin className="mx-auto mb-2 h-8 w-8 opacity-40" />
                <p className="text-sm">No hay ciudades registradas aún.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cities.map((city) => (
                        <TableRow
                            key={city.id}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    {city.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {city.location || (
                                    <span className="italic opacity-50">Sin ubicación</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:text-primary"
                                        onClick={() => onEdit(city)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:text-destructive"
                                        onClick={() => handleDelete(city)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
