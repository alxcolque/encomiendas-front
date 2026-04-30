import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, Truck, CheckCircle2, TrendingUp, Users, Building2, Plus, FileText } from "lucide-react";
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
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "@/constants/admin.routes";
import { useRegisterRefresh } from "@/stores/refreshStore";

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
  const { user } = useAuthStore();
  const { data, isLoading, fetchDashboardData } = useDashboardStore();

  const isWorker = user?.role === 'worker';
  const hasOffices = user?.offices && user.offices.length > 0;

  // Register refresh for pull-to-refresh
  useRegisterRefresh(fetchDashboardData);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className={`loading-logo ${"w-8 h-8 animate-pulse text-primary"}`}></div>
      </div>
    );
  }

  // Show empty state only if it's a worker with no offices assigned (verified by backend or auth)
  if (isWorker && !hasOffices && data.recent_shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 bg-card rounded-3xl border border-border/50 shadow-xl flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-bold font-display">Sin Agencia Asignada</h2>
          <p className="text-muted-foreground mt-2">
            No tienes agencias asignadas a tu cuenta. Contacta al administrador para que te asigne una oficina y puedas ver los datos operativos.
          </p>
          <div className="mt-6 text-sm font-medium px-4 py-2 bg-muted/50 rounded-lg text-muted-foreground">
            no hay nada para mostrar
          </div>
        </div>
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
        subtitle={isWorker && data?.city_name 
          ? `Resumen de operaciones en ${data.city_name} - ${currentDate}`
          : `Resumen de operaciones - ${currentDate}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:h-11 md:px-4 md:py-2 md:text-sm gap-2"
              onClick={() => navigate(ADMIN_ROUTES.REPORTS)}
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              Ver Reportes
            </Button>
            <NewShipmentModal
              trigger={
                <Button size="sm" className="md:h-11 md:px-4 md:py-2 md:text-sm gap-2 shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  Nueva Encomienda
                </Button>
              }
            />
          </div>
        }
      />

      {/* KPI Stats Grid - Only for Admin */}
      {!isWorker && <StatsCards stats={kpiStats} />}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentsChart data={data.charts.shipments} />
        <RevenueChart data={data.charts.revenue} />
        <StatusChart data={data.charts.status} />
      </div>

      {/* Main Content Grid: Table & Sidebars */}
      <div className={`grid grid-cols-1 ${isWorker ? '' : 'xl:grid-cols-3'} gap-6`}>

        {/* Left Column: Recent Shipments & Office Performance */}
        <div className={`${isWorker ? 'xl:col-span-3' : 'xl:col-span-2'} space-y-6`}>
          <RecentShipmentsTable shipments={data.recent_shipments} limit={10} />

          {!isWorker && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OfficePerformanceList offices={data.office_performance} />
              {/* Can add another component here or extend OfficePerformance */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-md p-6 flex flex-col justify-center items-start space-y-4">
                <div className="p-3 bg-primary/10 rounded-xl shadow-sm">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Resumen del Día</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    La eficiencia operativa ha subido un 5% respecto a ayer. Se detectaron 2 retrasos menores en la ruta Oruro-La Paz.
                  </p>
                </div>
                <Button variant="ghost" className="p-0 h-auto font-bold text-primary hover:text-primary/80 hover:bg-transparent">
                  Ver detalles operativos →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Drivers & Quick Stats - Only for Admin */}
        {!isWorker && (
          <div className="space-y-6">
            <ActiveDriversList drivers={data.active_drivers} />

            {/* Quick Stats / Secondary Metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-3xl font-black">{data.active_drivers_count}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conductores</span>
              </div>
              <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="text-3xl font-black">{data.total_offices_count}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agencias</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
