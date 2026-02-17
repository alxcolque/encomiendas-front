import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { ReportsStats } from "@/components/admin/reports/ReportsStats";
import { RevenueChart } from "@/components/admin/reports/RevenueChart";
import { ShipmentVolumeChart } from "@/components/admin/reports/ShipmentVolumeChart";
import { OrderStatusChart } from "@/components/admin/reports/OrderStatusChart";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"; // Assuming we have one or will verify, otherwise use a placeholder button

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
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[260px] justify-start text-left font-normal text-muted-foreground">
                        <span>Seleccionar fechas...</span>
                    </button>
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
                <div className="md:col-span-2 bg-card rounded-xl border border-border p-6">
                    <h3 className="font-semibold text-lg mb-4">Rendimiento por Oficina</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Oficina Central Oruro', value: 85, color: 'bg-primary' },
                            { name: 'Sucursal Terminal', value: 65, color: 'bg-blue-500' },
                            { name: 'Oficina La Paz', value: 45, color: 'bg-orange-500' },
                            { name: 'Oficina Cochabamba', value: 30, color: 'bg-green-500' },
                        ].map((office) => (
                            <div key={office.name} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{office.name}</span>
                                    <span>{office.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full ${office.color}`} style={{ width: `${office.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
