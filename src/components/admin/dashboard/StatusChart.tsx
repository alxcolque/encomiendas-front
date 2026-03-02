import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface StatusChartProps {
    data: { [key: string]: number };
}

const statusColors: Record<string, string> = {
    created: "hsl(var(--primary))",
    in_transit: "#3b82f6",
    at_office: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
};

export function StatusChart({ data }: StatusChartProps) {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
        value,
        color: statusColors[name] || "hsl(var(--muted))"
    }));

    return (
        <Card className="shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Distribución por Estado</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
