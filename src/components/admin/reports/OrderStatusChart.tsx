import { Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface OrderStatusChartProps {
    chartData: { browser: string; visitors: number; fill: string }[];
}

const chartConfig = {
    delivered: {
        label: "Entregado",
        color: "hsl(var(--chart-1))",
    },
    in_transit: {
        label: "En Ruta",
        color: "hsl(var(--chart-2))",
    },
    at_office: {
        label: "En Sucursal",
        color: "hsl(var(--chart-3))",
    },
    created: {
        label: "Creado",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

export function OrderStatusChart({ chartData }: OrderStatusChartProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Estado de Envíos</CardTitle>
                <CardDescription>Distribución actual de estados</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
