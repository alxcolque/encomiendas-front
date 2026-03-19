import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsStatsProps {
    kpi: {
        revenue: number;
        shipments: number;
        activeUsers: number;
        efficiency: number;
    }
}

export function ReportsStats({ kpi }: ReportsStatsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
                { label: "Ingresos Facturados", value: `Bs ${Number(kpi.revenue || 0).toFixed(2)}`, icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
                { label: "Encomiendas", value: kpi.shipments, icon: Package, color: "text-primary", bgColor: "bg-primary/10" },
                { label: "Usuarios Activos", value: kpi.activeUsers, icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
                { label: "Eficiencia de Entrega", value: `${kpi.efficiency}%`, icon: TrendingUp, color: "text-amber-500", bgColor: "bg-amber-500/10" },
            ].map((stat) => (
                <Card key={stat.label} className="border-border/50 shadow-md transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                        <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{stat.value}</div>
                    </CardContent>

                </Card>
            ))}
        </div>
    );
}
