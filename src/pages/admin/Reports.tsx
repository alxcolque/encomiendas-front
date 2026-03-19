import { useEffect, useState } from "react";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { ReportsStats } from "@/components/admin/reports/ReportsStats";
import { RevenueChart } from "@/components/admin/reports/RevenueChart";
import { ShipmentVolumeChart } from "@/components/admin/reports/ShipmentVolumeChart";
import { OrderStatusChart } from "@/components/admin/reports/OrderStatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useReportStore } from "@/stores/reportStore";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, endOfMonth, endOfYear, endOfWeek } from "date-fns";

type DateFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

export default function Reports() {
    const { data, isLoading, fetchReportData } = useReportStore();
    const [filter, setFilter] = useState<DateFilter>('month');

    // Default dates
    const [startDate, setStartDate] = useState<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    useEffect(() => {
        const today = new Date();
        let newStart = startDate;
        let newEnd = endDate;

        switch (filter) {
            case 'today':
                newStart = format(today, 'yyyy-MM-dd');
                newEnd = format(today, 'yyyy-MM-dd');
                break;
            case 'week':
                newStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                newEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                break;
            case 'month':
                newStart = format(startOfMonth(today), 'yyyy-MM-dd');
                newEnd = format(endOfMonth(today), 'yyyy-MM-dd');
                break;
            case 'year':
                newStart = format(startOfYear(today), 'yyyy-MM-dd');
                newEnd = format(endOfYear(today), 'yyyy-MM-dd');
                break;
            case 'custom':
                return; // Do not auto-fetch on custom selection until dates are manually changed
        }

        setStartDate(newStart);
        setEndDate(newEnd);
        fetchReportData(newStart, newEnd);
    }, [filter]);

    // Handle custom date applies
    useEffect(() => {
        if (filter === 'custom' && startDate && endDate) {
            fetchReportData(startDate, endDate);
        }
    }, [startDate, endDate, filter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AdminSectionHeader
                    title="Reportes y Estadísticas"
                    subtitle="Análisis detallado del rendimiento de la empresa"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select value={filter} onValueChange={(v: DateFilter) => setFilter(v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="week">Esta Semana</SelectItem>
                            <SelectItem value="month">Este Mes</SelectItem>
                            <SelectItem value="year">Este Año</SelectItem>
                            <SelectItem value="custom">Rango Personalizado</SelectItem>
                        </SelectContent>
                    </Select>

                    {filter === 'custom' && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-[150px]"
                            />
                            <span>-</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-[150px]"
                            />
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : !data ? (
                <div className="text-center text-muted-foreground p-12">No hay datos disponibles</div>
            ) : (
                <>
                    <ReportsStats kpi={data.kpi} />

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                        <RevenueChart chartData={data.charts.revenue} />
                        <ShipmentVolumeChart chartData={data.charts.volume} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <OrderStatusChart chartData={data.charts.status} />
                        <Card className="md:col-span-2 border-border/50 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Rendimiento por Agencia</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* This is just visual placeholder for office since we did not add office aggregation yet, but it can be fully functional later */}
                                {[
                                    { name: 'Agencia Central Oruro', value: 85, color: 'gradient-primary' },
                                    { name: 'Agencia Santa Cruz', value: 65, color: 'bg-blue-500' },
                                    { name: 'Agencia La Paz', value: 45, color: 'bg-orange-500' },
                                    { name: 'Agencia Cochabamba', value: 30, color: 'bg-green-500' },
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
                </>
            )}
        </div>
    );
}
