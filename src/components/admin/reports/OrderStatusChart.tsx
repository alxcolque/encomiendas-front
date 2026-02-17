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

const chartData = [
    { browser: "delivered", visitors: 850, fill: "var(--color-delivered)" },
    { browser: "transit", visitors: 200, fill: "var(--color-transit)" },
    { browser: "pending", visitors: 50, fill: "var(--color-pending)" },
    { browser: "cancelled", visitors: 20, fill: "var(--color-cancelled)" },
]

const chartConfig = {
    delivered: {
        label: "Entregado",
        color: "hsl(var(--chart-1))",
    },
    transit: {
        label: "En Ruta",
        color: "hsl(var(--chart-2))",
    },
    pending: {
        label: "Pendiente",
        color: "hsl(var(--chart-3))",
    },
    cancelled: {
        label: "Cancelado",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function OrderStatusChart() {
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
