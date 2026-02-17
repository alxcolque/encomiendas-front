import { useEffect } from "react";
import { useDriverStore } from "@/stores/driverStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreHorizontal, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DriversTable() {
    const { drivers, isLoading, fetchDrivers, deleteDriver } = useDriverStore();

    useEffect(() => {
        fetchDrivers();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Disponible</Badge>;
            case 'on-delivery': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">En Ruta</Badge>;
            default: return <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">Inactivo</Badge>;
        }
    };

    if (isLoading && drivers.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Cargando conductores...</div>;
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Licencia</TableHead>
                        <TableHead>Calificación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {drivers.map((driver) => (
                        <TableRow key={driver.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src={driver.avatar} alt={driver.name} />
                                    <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-xs text-muted-foreground">{driver.phone}</div>
                            </TableCell>
                            <TableCell>{driver.vehicleType}</TableCell>
                            <TableCell className="font-mono text-xs">{driver.plateNumber}</TableCell>
                            <TableCell className="font-mono text-xs">{driver.licenseNumber}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-amber-500 font-medium text-sm">
                                    <Star className="h-3 w-3 fill-current" />
                                    {driver.rating}
                                    <span className="text-xs text-muted-foreground ml-1">({driver.totalDeliveries})</span>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(driver.status)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(driver.phone)}>
                                            Copiar Teléfono
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteDriver(driver.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
