import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import { Eye, Loader2 } from "lucide-react";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function RecentShipmentsTable() {
    const { shipments, isLoading, fetchShipments } = useAdminShipmentStore();

    useEffect(() => {
        fetchShipments();
    }, []);

    if (isLoading && shipments.length === 0) {
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
        <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Últimas Encomiendas</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver todas</Button>
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
                                <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No se encontraron encomiendas registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                shipments.slice(0, 10).map((shipment) => (
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
                                        <TableCell className="font-medium text-foreground">Bs. {shipment.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={shipment.current_status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
