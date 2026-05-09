import { Card, CardContent } from "@/components/ui/card";
import { KPIData } from "@/interfaces/admin/dashboard.interface";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatsCardsProps {
    stats: KPIData[];
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                        {/* Header: icon + trend badge */}
                        <div className="flex items-start justify-between">
                            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-primary">
                                <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-0.5 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full",
                                stat.trend === 'up' ? "text-green-600 bg-green-50 dark:bg-green-900/20" :
                                    stat.trend === 'down' ? "text-red-600 bg-red-50 dark:bg-red-900/20" :
                                        "text-gray-600 bg-gray-50 dark:bg-gray-800"
                            )}>
                                {stat.trend === 'up' && <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                {stat.trend === 'down' && <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                {stat.trend === 'neutral' && <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                                <span>{Math.abs(stat.change)}%</span>
                            </div>
                        </div>

                        {/* Value + Label */}
                        <div className="mt-2 sm:mt-3 lg:mt-4">
                            <h3 className="text-lg sm:text-xl lg:text-3xl font-bold tracking-tight text-foreground font-display leading-tight">
                                {stat.value}
                            </h3>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1 font-medium leading-snug">
                                {stat.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
