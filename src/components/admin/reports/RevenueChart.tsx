import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
    { month: "Enero", revenue: 18600 },
    { month: "Febrero", revenue: 30500 },
    { month: "Marzo", revenue: 23700 },
    { month: "Abril", revenue: 17300 },
    { month: "Mayo", revenue: 20900 },
    { month: "Junio", revenue: 21400 },
    { month: "Julio", revenue: 35000 },
    { month: "Agosto", revenue: 28000 },
    { month: "Septiembre", revenue: 32000 },
    { month: "Octubre", revenue: 41000 },
    { month: "Noviembre", revenue: 45000 },
    { month: "Diciembre", revenue: 52000 },
];

const chartConfig = {
    revenue: {
        label: "Ingresos (Bs)",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function RevenueChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Ingresos Anuales</CardTitle>
                <CardDescription>Resumen de ingresos generados durante el año 2024</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
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
