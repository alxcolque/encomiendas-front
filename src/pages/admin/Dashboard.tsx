import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, Truck, CheckCircle2, TrendingUp, Users, Building2, Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { ShipmentsChart } from "@/components/admin/dashboard/ShipmentsChart";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { StatusChart } from "@/components/admin/dashboard/StatusChart";
import { RecentShipmentsTable } from "@/components/admin/dashboard/RecentShipmentsTable";
import { ActiveDriversList } from "@/components/admin/dashboard/ActiveDriversList";
import { OfficePerformanceList } from "@/components/admin/dashboard/OfficePerformance";

export default function AdminDashboard() {
  // Mock Data for KPI cards
  const kpiStats = [
    { label: "Total Encomiendas (Mes)", value: "1,245", change: 12.5, trend: "up" as const, icon: Package },
    { label: "En Tránsito", value: "85", change: 5.2, trend: "up" as const, icon: Truck },
    { label: "Entregadas", value: "1,120", change: 8.1, trend: "up" as const, icon: CheckCircle2 },
    { label: "Ingresos (Mes)", value: "Bs 145.2k", change: 15.3, trend: "up" as const, icon: TrendingUp },
  ];

  const currentDate = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <AdminSectionHeader
        title="Panel Administrativo"
        subtitle={`Resumen de operaciones - ${currentDate}`}
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Ver Reportes
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4" />
              Nueva Encomienda
            </Button>
          </>
        }
      />

      {/* KPI Stats Grid */}
      <StatsCards stats={kpiStats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShipmentsChart />
        <RevenueChart />
        <StatusChart />
      </div>

      {/* Main Content Grid: Table & Sidebars */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Recent Shipments & Office Performance */}
        <div className="xl:col-span-2 space-y-6">
          <RecentShipmentsTable />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OfficePerformanceList />
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
          <ActiveDriversList />

          {/* Quick Stats / Secondary Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 border border-border/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">24</span>
              <span className="text-xs text-muted-foreground">Conductores Activos</span>
            </div>
            <div className="bg-card/50 border border-border/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <span className="text-2xl font-bold">7</span>
              <span className="text-xs text-muted-foreground">Oficinas Operativas</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
