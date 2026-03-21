import { useEffect, useState } from "react";
import { useRouteValueStore } from "@/stores/routeValueStore";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Route, Trash2 } from "lucide-react";
import { LoadingLogo } from "@/components/shared/LoadingLogo";
import { toast } from "sonner";

export function RoutesTab() {
    const { routeValues, isLoading, fetchRouteValues, updateRouteValue, createRouteValue, deleteRouteValue } =
        useRouteValueStore();
    const { cities, fetchCities } = useCityStore();

    // Local state for in-row editing
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // New route form
    const [newCityA, setNewCityA] = useState("");
    const [newCityB, setNewCityB] = useState("");
    const [newValue, setNewValue] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchRouteValues();
        fetchCities();
    }, []);

    // Sync local input state when routeValues load/change
    useEffect(() => {
        const initial: Record<string, string> = {};
        routeValues.forEach((rv) => {
            if (!(rv.id in editedValues)) {
                initial[rv.id] = String(rv.value);
            }
        });
        if (Object.keys(initial).length) {
            setEditedValues((prev) => ({ ...initial, ...prev }));
        }
    }, [routeValues]);

    const handleUpdate = async (id: string) => {
        const val = parseFloat(editedValues[id]);
        if (isNaN(val) || val < 0) {
            toast.error("El valor debe ser un número positivo");
            return;
        }
        setUpdatingId(id);
        try {
            await updateRouteValue(id, val);
            toast.success("Tarifa actualizada");
        } catch (error: any) {
            toast.error("Error al actualizar tarifa", {
                description: error.response?.data?.message || "Error inesperado",
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string, label: string) => {
        if (!confirm(`¿Eliminar la ruta "${label}"?`)) return;
        try {
            await deleteRouteValue(id);
            toast.success("Ruta eliminada");
        } catch (error: any) {
            toast.error("Error al eliminar ruta");
        }
    };

    const handleCreate = async () => {
        if (!newCityA || !newCityB || !newValue) {
            toast.error("Completa todos los campos para agregar una ruta");
            return;
        }
        if (newCityA === newCityB) {
            toast.error("Las ciudades de origen y destino no pueden ser iguales");
            return;
        }
        const val = parseFloat(newValue);
        if (isNaN(val) || val < 0) {
            toast.error("El valor debe ser un número positivo");
            return;
        }
        setIsCreating(true);
        try {
            await createRouteValue({ city_a: newCityA, city_b: newCityB, value: val });
            toast.success("Ruta creada correctamente");
            setNewCityA("");
            setNewCityB("");
            setNewValue("");
        } catch (error: any) {
            toast.error("Error al crear ruta", {
                description: error.response?.data?.message || "Error inesperado",
            });
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading && routeValues.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">Cargando rutas...</div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add new route form */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Agregar nueva ruta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_auto] gap-3 items-end">
                    <div className="space-y-1">
                        <Label className="text-xs">Ciudad A</Label>
                        <Select value={newCityA} onValueChange={setNewCityA}>
                            <SelectTrigger>
                                <SelectValue placeholder="Origen" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Ciudad B</Label>
                        <Select value={newCityB} onValueChange={setNewCityB}>
                            <SelectTrigger>
                                <SelectValue placeholder="Destino" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Valor (Bs.)</Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleCreate} disabled={isCreating} className="gap-2">
                        {isCreating ? (
                            <LoadingLogo className="h-4 w-4 animate-pulse" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        Agregar
                    </Button>
                </div>
            </div>

            {/* Routes table */}
            {routeValues.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground border rounded-xl border-dashed">
                    <Route className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    <p className="text-sm">No hay rutas configuradas aún.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead>Ciudad A</TableHead>
                                <TableHead></TableHead>
                                <TableHead>Ciudad B</TableHead>
                                <TableHead className="w-40">Valor (Bs.)</TableHead>
                                <TableHead className="text-right w-36">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routeValues.map((rv) => (
                                <TableRow
                                    key={rv.id}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="font-medium">
                                        {rv.city_a?.name ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-0">
                                        <ArrowRight className="h-4 w-4" />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {rv.city_b?.name ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-32 h-8 text-sm"
                                            value={editedValues[rv.id] ?? String(rv.value)}
                                            onChange={(e) =>
                                                setEditedValues((prev) => ({
                                                    ...prev,
                                                    [rv.id]: e.target.value,
                                                }))
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs"
                                                disabled={updatingId === rv.id}
                                                onClick={() => handleUpdate(rv.id)}
                                            >
                                                {updatingId === rv.id ? (
                                                    <LoadingLogo className="h-3 w-3 animate-pulse mr-1" />
                                                ) : null}
                                                Actualizar
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:text-destructive"
                                                onClick={() =>
                                                    handleDelete(
                                                        rv.id,
                                                        `${rv.city_a?.name} → ${rv.city_b?.name}`
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
