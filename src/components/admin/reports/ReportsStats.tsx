import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportsStats() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
                { label: "Ingresos Totales", value: "Bs 45,231.89", subvalue: "+20.1% respecto al mes pasado", icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
                { label: "Encomiendas", value: "+2350", subvalue: "+180.1% respecto al mes pasado", icon: Package, color: "text-primary", bgColor: "bg-primary/10" },
                { label: "Usuarios Activos", value: "+12,234", subvalue: "+19% respecto al mes pasado", icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
                { label: "Eficiencia de Entrega", value: "98.5%", subvalue: "+2.4% respecto al mes pasado", icon: TrendingUp, color: "text-amber-500", bgColor: "bg-amber-500/10" },
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
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {stat.subvalue}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
