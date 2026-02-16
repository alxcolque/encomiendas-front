import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../shared/StatusBadge";
import { Eye } from "lucide-react";
import { ShipmentData } from "@/interfaces/admin/dashboard.interface";

const recentShipments: ShipmentData[] = [
    { id: "1", code: "SH-2839", client: "Empresa Minera Huanuni", origin: "Oruro", destination: "La Paz", status: "in_transit", date: "2024-02-15", amount: 150 },
    { id: "2", code: "SH-2838", client: "Juan Perez", origin: "Cochabamba", destination: "Santa Cruz", status: "delivered", date: "2024-02-14", amount: 85 },
    { id: "3", code: "SH-2837", client: "Tech Solutions", origin: "La Paz", destination: "Oruro", status: "pending", date: "2024-02-14", amount: 240 },
    { id: "4", code: "SH-2836", client: "Maria Lopez", origin: "Santa Cruz", destination: "Cochabamba", status: "delivered", date: "2024-02-13", amount: 50 },
    { id: "5", code: "SH-2835", client: "Constructora Global", origin: "La Paz", destination: "El Alto", status: "in_transit", date: "2024-02-13", amount: 1200 },
];

export function RecentShipmentsTable() {
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
                                <TableHead className="w-[100px]">Código</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Ruta</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentShipments.map((shipment) => (
                                <TableRow key={shipment.id} className="hover:bg-muted/50 border-border/50 transition-colors">
                                    <TableCell className="font-medium">{shipment.code}</TableCell>
                                    <TableCell className="text-muted-foreground">{shipment.client}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs">
                                            <span className="font-medium">{shipment.origin}</span>
                                            <span className="text-muted-foreground">→ {shipment.destination}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{shipment.date}</TableCell>
                                    <TableCell className="font-medium text-foreground">Bs. {shipment.amount}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={shipment.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
