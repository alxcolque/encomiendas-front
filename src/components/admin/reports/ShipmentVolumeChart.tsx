import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ShipmentVolumeChartProps {
    chartData: { label: string; packages: number }[];
}

const chartConfig = {
    packages: {
        label: "Encomiendas",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ShipmentVolumeChart({ chartData }: ShipmentVolumeChartProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Volumen Semanal</CardTitle>
                <CardDescription>Cantidad de encomiendas enviadas esta semana</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                            className="text-xs"
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey="packages"
                            type="natural"
                            fill="var(--color-packages)"
                            fillOpacity={0.4}
                            stroke="var(--color-packages)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
