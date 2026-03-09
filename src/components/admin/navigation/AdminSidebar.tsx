import { LayoutDashboard, Package, Users, UserCheck, Truck, Building2, FileBarChart, Settings, MapPin } from "lucide-react";
import { AdminSidebarItem } from "./AdminSidebarItem";
import { ADMIN_ROUTES } from "@/constants/admin.routes";
import { cn } from "@/lib/utils";
import kolmoxLogo from "@/assets/kolmox-logo.png"; // reusing existing asset

interface AdminSidebarProps {
    className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 flex flex-col transition-all duration-300 z-40 hidden lg:flex",
            className
        )}>
            {/* Logo Header */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-border/50">
                <img
                    src={kolmoxLogo}
                    alt="KOLMOX"
                    className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="font-display font-bold text-lg tracking-tight">KOLMOX</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Principal
                </div>
                <AdminSidebarItem icon={LayoutDashboard} label="Dashboard" path={ADMIN_ROUTES.DASHBOARD} />
                <AdminSidebarItem icon={Package} label="Encomiendas" path={ADMIN_ROUTES.SHIPMENTS} />
                <AdminSidebarItem icon={Users} label="Usuarios" path={ADMIN_ROUTES.USERS} />
                <AdminSidebarItem icon={UserCheck} label="Clientes" path={ADMIN_ROUTES.CLIENTS} />
                <AdminSidebarItem icon={Building2} label="Empresas" path={ADMIN_ROUTES.BUSINESSES} />

                <div className="px-3 mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Operaciones
                </div>
                <AdminSidebarItem icon={Truck} label="Conductores" path={ADMIN_ROUTES.DRIVERS} />
                <AdminSidebarItem icon={Building2} label="Agencias" path={ADMIN_ROUTES.OFFICES} />
                <AdminSidebarItem icon={MapPin} label="Ciudades y Rutas" path={ADMIN_ROUTES.CITIES} />

                <div className="px-3 mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sistema
                </div>
                <AdminSidebarItem icon={FileBarChart} label="Reportes" path={ADMIN_ROUTES.REPORTS} />
                <AdminSidebarItem icon={Settings} label="Configuración" path={ADMIN_ROUTES.SETTINGS} />
            </nav>

            {/* Footer / User Info could go here if not in TopNavbar */}
            <div className="p-4 border-t border-border/50">
                <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground text-center">
                    <p>v1.0.0 Admin Panel</p>
                    <p className="opacity-70 mt-1">©{new Date().getFullYear()} {import.meta.env.VITE_COMPANY_NAME} Inc.</p>
                </div>
            </div>
        </aside>
    );
}
