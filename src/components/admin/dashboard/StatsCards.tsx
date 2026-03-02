import { Card, CardContent } from "@/components/ui/card";
import { KPIData } from "@/interfaces/admin/dashboard.interface";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatsCardsProps {
    stats: KPIData[];
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                stat.trend === 'up' ? "text-green-600 bg-green-50 dark:bg-green-900/20" :
                                    stat.trend === 'down' ? "text-red-600 bg-red-50 dark:bg-red-900/20" :
                                        "text-gray-600 bg-gray-50 dark:bg-gray-800"
                            )}>
                                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend === 'neutral' && <Minus className="w-3 h-3" />}
                                <span>{Math.abs(stat.change)}%</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-3xl font-bold tracking-tight text-foreground font-display">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">
                                {stat.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
