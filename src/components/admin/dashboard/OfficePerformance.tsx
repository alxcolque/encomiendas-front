import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficePerformance } from "@/interfaces/admin/dashboard.interface";
import { Progress } from "@/components/ui/progress";

const officeData: OfficePerformance[] = [
    { id: "1", name: "Oruro Central", processedShipments: 1250, revenue: 15400, efficiency: 95 },
    { id: "2", name: "La Paz Centro", processedShipments: 980, revenue: 12300, efficiency: 88 },
    { id: "3", name: "Santa Cruz Norte", processedShipments: 850, revenue: 10500, efficiency: 92 },
    { id: "4", name: "Cochabamba Sur", processedShipments: 620, revenue: 7800, efficiency: 85 },
];

export function OfficePerformanceList() {
    return (
        <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Rendimiento por Oficina</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {officeData.map((office) => (
                    <div key={office.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="font-medium">{office.name}</div>
                            <div className="text-muted-foreground">{office.efficiency}% Eficiencia</div>
                        </div>
                        <Progress value={office.efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{office.processedShipments} envíos</span>
                            <span>Bs. {office.revenue.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
