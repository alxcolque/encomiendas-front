import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "../shared/StatusBadge";
import { DriverStatus } from "@/interfaces/admin/dashboard.interface";

interface ActiveDriversListProps {
    drivers: any[];
}

export function ActiveDriversList({ drivers }: ActiveDriversListProps) {
    return (
        <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Conductores Activos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {drivers?.length > 0 ? (
                    drivers.map((driver) => (
                        <div key={driver.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src={driver.avatar} alt={driver.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">{driver.name?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">{driver.name}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                        {driver.status === 'busy' ? "En ruta" : "En espera"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <StatusBadge status={driver.status} className="text-[10px] px-1.5 py-0" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground italic">
                        No hay conductores activos actualmente
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
