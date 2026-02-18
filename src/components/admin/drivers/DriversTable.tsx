import { useState, useEffect } from "react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Trash2, Edit, Truck } from "lucide-react";
import { DriverModal } from "./DriverModal";
import { useDriverStore } from "@/stores/driverStore";
import { Driver } from "@/interfaces/driver.interface";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DriversTable() {
    const { drivers, fetchDrivers, deleteDriver, isLoading } = useDriverStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (driver: Driver) => {
        setDriverToEdit(driver);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setDriverToEdit(null);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteDriver(deleteId);
            setDeleteId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "inactive": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
            case "on-delivery": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active": return "Activo";
            case "inactive": return "Inactivo";
            case "on-delivery": return "En Ruta";
            default: return status;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar conductor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                    <Truck className="mr-2 h-4 w-4" />
                    Nuevo Conductor
                </Button>
            </div>

            <div className="rounded-md border border-border bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50 border-border">
                            <TableHead>Conductor</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead>Vehículo</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Rendimiento</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Cargando conductores...
                                </TableCell>
                            </TableRow>
                        ) : filteredDrivers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No se encontraron conductores
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDrivers.map((driver) => (
                                <TableRow key={driver.id} className="hover:bg-muted/50 border-border">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={driver.avatar} />
                                                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-foreground">{driver.name}</div>
                                                <div className="text-xs text-muted-foreground line-clamp-1">{driver.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{driver.email}</div>
                                        <div className="text-xs text-muted-foreground">{driver.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-3 w-3 text-muted-foreground" />
                                            <span>{driver.vehicle_type}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono uppercase">
                                            {driver.plate_number}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(driver.status)}>
                                            {getStatusLabel(driver.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <div className="text-sm font-medium">{Number(driver.rating).toFixed(1)} ★</div>
                                            <div className="text-xs text-muted-foreground">{driver.total_deliveries} envíos</div>
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuItem onClick={() => handleEdit(driver)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => setDeleteId(driver.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DriverModal
                driverToEdit={driverToEdit}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al conductor y su cuenta de usuario asociada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
