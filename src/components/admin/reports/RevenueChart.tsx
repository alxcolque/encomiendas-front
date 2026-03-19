import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface RevenueChartProps {
    chartData: { label: string; revenue: number }[];
}

const chartConfig = {
    revenue: {
        label: "Ingresos (Bs)",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function RevenueChart({ chartData }: RevenueChartProps) {
    return (
        <Card className="col-span-4 border-border/50 shadow-md transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle>Ingresos Anuales</CardTitle>
                <CardDescription>Resumen de ingresos generados durante el año 2024</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                            className="text-xs"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
