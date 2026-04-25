import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import {
    Eye,

    FileText,
    MoreVertical,
    CheckCircle2,
    Truck,
    Package,
    RotateCcw,
    XCircle,
    Send,
    ExternalLink,
    Printer,
    Search,
    Trash2
} from "lucide-react";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceDocument } from "@/components/worker/shipment/InvoiceDocument";
import { AdminShipment, ShipmentStatus } from "@/interfaces/shipment.interface";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface RecentShipmentsTableProps {
    shipments?: AdminShipment[];
    limit?: number; // Optional limit for dashboard (e.g., 10)
    showSearch?: boolean; // Toggles the search input via tracking code
    title?: string;
    showViewAll?: boolean; // Toggles the "Ver todas" button
}

export function RecentShipmentsTable({
    shipments: propShipments,
    limit,
    showSearch = false,
    title = "Últimas Encomiendas",
    showViewAll = true
}: RecentShipmentsTableProps) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const role = user?.role || 'client';
    const { shipments: storeShipments, isLoading, fetchShipments, updateStatus, deleteShipment } = useAdminShipmentStore();

    // Choose which shipments to use
    const displayedShipments = propShipments || storeShipments;
    const [selectedShipment, setSelectedShipment] = useState<AdminShipment | null>(null);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleViewInvoice = (shipment: AdminShipment) => {
        setSelectedShipment(shipment);
        setIsInvoiceOpen(true);
    };

    const handleUpdateStatus = async (id: string, status: ShipmentStatus) => {
        try {
            await updateStatus(id, status);
            toast.success(`Estado actualizado a ${status}`);
        } catch (error) {
            toast.error("Error al actualizar el estado");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que desea eliminar esta encomienda?")) return;
        try {
            await deleteShipment(id);
            toast.success("Encomienda eliminada");
        } catch (error) {
            toast.error("Error al eliminar la encomienda");
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    if (isLoading && displayedShipments.length === 0) {
        return (
            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="loading-logo-section"></div>
            </Card>
        );
    }

    // Sort by latest first
    const sortedShipments = [...displayedShipments].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        // If same date, sort by ID descending just in case
        if (dateB === dateA) {
            return Number(b.id) - Number(a.id);
        }
        return dateB - dateA;
    });

    // Filter by Tracking Code
    const filteredShipments = sortedShipments.filter(s =>
        !searchQuery || s.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply limit if provided
    const finalShipments = limit ? filteredShipments.slice(0, limit) : filteredShipments;

    return (
        <Card className="border-border/50 shadow-md bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <div className="flex items-center gap-3">
                    {showSearch && (
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por código..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>
                    )}
                    {showViewAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => navigate('/admin/shipments')}
                        >
                            Ver todas
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="w-[120px]">Código</TableHead>
                                <TableHead>Remitente</TableHead>
                                <TableHead>Destinatario</TableHead>
                                <TableHead>Ruta</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Opciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finalShipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No se encontraron encomiendas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                finalShipments.map((shipment) => (
                                    <TableRow key={shipment.id} className="hover:bg-muted/50 border-border/50 transition-colors">
                                        <TableCell className="font-mono font-bold text-primary">{shipment.tracking_code}</TableCell>
                                        <TableCell className="text-muted-foreground">{shipment.sender_name}</TableCell>
                                        <TableCell className="text-muted-foreground">{shipment.receiver_name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span className="font-medium text-foreground">
                                                    {shipment.origin_office?.city?.name || "N/A"}
                                                </span>
                                                <span className="text-muted-foreground">→ {shipment.destination_office?.city?.name || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {shipment.created_at ? format(new Date(shipment.created_at), 'dd MMM yyyy', { locale: es }) : '-'}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">Bs. {Number(shipment.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={shipment.current_status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(shipment.current_status === 'quote' || role !== 'company') && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {role !== 'company' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer"
                                                                    onClick={() => navigate(`/admin/shipments/${shipment.id}`)}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Ver detalles
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    className="cursor-pointer"
                                                                    onClick={() => window.open(`/admin/ticket/${shipment.id}`, '_blank')}
                                                                >
                                                                    <Printer className="w-4 h-4 mr-2" />
                                                                    Imprimir Etiqueta
                                                                </DropdownMenuItem>

                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuSub>
                                                                    <DropdownMenuSubTrigger className="cursor-pointer">
                                                                        <RotateCcw className="w-4 h-4 mr-2" />
                                                                        Cambiar estado
                                                                    </DropdownMenuSubTrigger>
                                                                    <DropdownMenuPortal>
                                                                        <DropdownMenuSubContent>
                                                                            <DropdownMenuItem
                                                                                className="cursor-pointer"
                                                                                onClick={() => handleUpdateStatus(shipment.id, 'created')}
                                                                            >
                                                                                <Package className="w-4 h-4 mr-2 text-purple-500" />
                                                                                Creado
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className="cursor-pointer"
                                                                                onClick={() => handleUpdateStatus(shipment.id, 'in_transit')}
                                                                            >
                                                                                <Truck className="w-4 h-4 mr-2 text-blue-500" />
                                                                                En Tránsito
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className="cursor-pointer"
                                                                                onClick={() => handleUpdateStatus(shipment.id, 'at_office')}
                                                                            >
                                                                                <Package className="w-4 h-4 mr-2 text-indigo-500" />
                                                                                En Sucursal
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                className="cursor-pointer"
                                                                                onClick={() => handleUpdateStatus(shipment.id, 'delivered')}
                                                                            >
                                                                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                                                                Entregado
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuPortal>
                                                                </DropdownMenuSub>
                                                            </>
                                                        )}

                                                        {shipment.current_status === 'quote' && (
                                                            <>
                                                                {role !== 'company' && <DropdownMenuSeparator />}
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700"
                                                                    onClick={() => handleDelete(shipment.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Eliminar
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Factura</DialogTitle>
                    </DialogHeader>
                    {selectedShipment?.invoice && (
                        <InvoiceDocument
                            invoice={selectedShipment.invoice}
                            onClose={() => setIsInvoiceOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
