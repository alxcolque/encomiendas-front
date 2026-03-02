import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { ReportsStats } from "@/components/admin/reports/ReportsStats";
import { RevenueChart } from "@/components/admin/reports/RevenueChart";
import { ShipmentVolumeChart } from "@/components/admin/reports/ShipmentVolumeChart";
import { OrderStatusChart } from "@/components/admin/reports/OrderStatusChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";



export default function Reports() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AdminSectionHeader
                    title="Reportes y Estadísticas"
                    subtitle="Análisis detallado del rendimiento de la empresa"
                />
                {/* Placeholder for date picker if component doesn't exist yet */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-[260px] justify-start text-left font-normal text-muted-foreground border-border/50">
                        <span>Seleccionar fechas...</span>
                    </Button>
                </div>
            </div>

            <ReportsStats />

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <RevenueChart />
                <ShipmentVolumeChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OrderStatusChart />
                {/* Can add more charts or lists here like Top Drivers or Office Performance */}
                <Card className="md:col-span-2 border-border/50 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Rendimiento por Oficina</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: 'Oficina Central Oruro', value: 85, color: 'gradient-primary' },
                            { name: 'Sucursal Terminal', value: 65, color: 'bg-blue-500' },
                            { name: 'Oficina La Paz', value: 45, color: 'bg-orange-500' },
                            { name: 'Oficina Cochabamba', value: 30, color: 'bg-green-500' },
                        ].map((office) => (
                            <div key={office.name} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-foreground">{office.name}</span>
                                    <span className="text-primary">{office.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full ${office.color} shadow-lg transition-all duration-500`} style={{ width: `${office.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
