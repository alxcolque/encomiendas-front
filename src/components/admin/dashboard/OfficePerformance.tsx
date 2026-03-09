import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficePerformance } from "@/interfaces/admin/dashboard.interface";
import { Progress } from "@/components/ui/progress";

interface OfficePerformanceProps {
    offices: { name: string; total: number }[];
}

export function OfficePerformanceList({ offices }: OfficePerformanceProps) {
    return (
        <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Rendimiento por Agencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {offices.map((office, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="font-medium">{office.name}</div>
                            <div className="text-muted-foreground">{office.total} envíos</div>
                        </div>
                        <Progress value={Math.min(100, (office.total / 1000) * 100)} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
