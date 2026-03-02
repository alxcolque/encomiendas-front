import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, Truck, CheckCircle2, TrendingUp, Users, Building2, Plus, FileText, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { ShipmentsChart } from "@/components/admin/dashboard/ShipmentsChart";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { StatusChart } from "@/components/admin/dashboard/StatusChart";
import { RecentShipmentsTable } from "@/components/admin/dashboard/RecentShipmentsTable";
import { ActiveDriversList } from "@/components/admin/dashboard/ActiveDriversList";
import { OfficePerformanceList } from "@/components/admin/dashboard/OfficePerformance";
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/constants/admin.routes";

const iconMap: Record<string, any> = {
  Package,
  Truck,
  CheckCircle2,
  TrendingUp,
  Users,
  Building2,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Map icons for KPI cards
  const kpiStats = data.kpi.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon] || Package
  }));

  const currentDate = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <AdminSectionHeader
        title="Panel Administrativo"
        subtitle={`Resumen de operaciones - ${currentDate}`}
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate(ADMIN_ROUTES.REPORTS)}
            >
              <FileText className="w-4 h-4" />
              Ver Reportes
            </Button>
            <NewShipmentModal
              trigger={
                <Button className="gap-2 shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4" />
                  Nueva Encomienda
                </Button>
              }
            />
          </>
        }
      />

      {/* KPI Stats Grid */}
      <StatsCards stats={kpiStats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentsChart data={data.charts.shipments} />
        <RevenueChart data={data.charts.revenue} />
        <StatusChart data={data.charts.status} />
      </div>

      {/* Main Content Grid: Table & Sidebars */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Recent Shipments & Office Performance */}
        <div className="xl:col-span-2 space-y-6">
          <RecentShipmentsTable shipments={data.recent_shipments} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OfficePerformanceList offices={data.office_performance} />
            {/* Can add another component here or extend OfficePerformance */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6 flex flex-col justify-center items-start space-y-4">
              <div className="p-3 bg-background rounded-full shadow-sm">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">Resumen del Día</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  La eficiencia operativa ha subido un 5% respecto a ayer. Se detectaron 2 retrasos menores en la ruta Oruro-La Paz.
                </p>
              </div>
              <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-transparent">
                Ver detalles operativos →
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Drivers & Quick Stats */}
        <div className="space-y-6">
          <ActiveDriversList drivers={data.active_drivers} />

          {/* Quick Stats / Secondary Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 border border-border/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{data.active_drivers_count}</span>
              <span className="text-xs text-muted-foreground">Conductores Activos</span>
            </div>
            <div className="bg-card/50 border border-border/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <span className="text-2xl font-bold">{data.total_offices_count}</span>
              <span className="text-xs text-muted-foreground">Oficinas Operativas</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
