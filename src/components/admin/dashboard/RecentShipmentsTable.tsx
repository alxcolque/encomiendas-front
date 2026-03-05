import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import {
    Eye,
    Loader2,
    FileText,
    MoreVertical,
    CheckCircle2,
    Truck,
    Package,
    RotateCcw,
    XCircle,
    Send,
    ExternalLink,
    Printer
} from "lucide-react";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
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

interface RecentShipmentsTableProps {
    shipments?: AdminShipment[];
}

export function RecentShipmentsTable({ shipments: propShipments }: RecentShipmentsTableProps) {
    const navigate = useNavigate();
    const { shipments: storeShipments, isLoading, fetchShipments, updateStatus } = useAdminShipmentStore();

    // Choose which shipments to use
    const displayedShipments = propShipments || storeShipments;
    const [selectedShipment, setSelectedShipment] = useState<AdminShipment | null>(null);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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

    useEffect(() => {
        fetchShipments();
    }, []);

    if (isLoading && displayedShipments.length === 0) {
        return (
            <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Cargando encomiendas...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Últimas Encomiendas</CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => navigate('/admin/shipments')}
                >
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent>
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
                            {displayedShipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No se encontraron encomiendas registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedShipments.slice(0, 10).map((shipment) => (
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
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

                                                    {/* {shipment.invoice && (
                                                        <>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => handleViewInvoice(shipment)}
                                                            >
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                Ver factura (Modal)
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => window.open(`/shipments/${shipment.id}/invoice`, '_blank')}
                                                            >
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                Ver factura (Nueva pestaña)
                                                            </DropdownMenuItem>
                                                        </>
                                                    )} */}
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
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
