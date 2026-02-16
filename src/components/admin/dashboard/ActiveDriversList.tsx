import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "../shared/StatusBadge";
import { DriverStatus } from "@/interfaces/admin/dashboard.interface";

const activeDrivers: DriverStatus[] = [
    { id: "1", name: "Carlos Mamani", status: "busy", activeShipments: 3, currentTask: "Entregando en Zona Sur" },
    { id: "2", name: "Pedro Quispe", status: "available", activeShipments: 0 },
    { id: "3", name: "Ana Torres", status: "busy", activeShipments: 5, currentTask: "Ruta Interdepartamental" },
    { id: "4", name: "Luis Fernandez", status: "offline", activeShipments: 0 },
    { id: "5", name: "Jorge Lima", status: "busy", activeShipments: 2, currentTask: "Recolección Centro" },
];

export function ActiveDriversList() {
    return (
        <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Conductores Activos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={driver.avatar} alt={driver.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">{driver.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium leading-none">{driver.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                    {driver.currentTask || "Sin asignación"}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <StatusBadge status={driver.status} className="text-[10px] px-1.5 py-0" />
                            {driver.activeShipments > 0 && (
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    {driver.activeShipments} envíos
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
