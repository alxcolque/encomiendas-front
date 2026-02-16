import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Package, Settings } from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/admin.routes";

const mobileNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Panel", path: ADMIN_ROUTES.DASHBOARD },
    { icon: Package, label: "Envíos", path: ADMIN_ROUTES.SHIPMENTS },
    { icon: Users, label: "Usuarios", path: ADMIN_ROUTES.USERS },
    { icon: Settings, label: "Ajustes", path: ADMIN_ROUTES.SETTINGS },
];

export default function AdminLayout() {
    return (
        <>
            {/* DESKTOP LAYOUT (lg+) */}
            <div className="hidden lg:flex min-h-screen bg-background">
                {/* Fixed Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
                    <TopNavbar /> {/* Reusing TopNavbar, check if it fits width */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <div className="max-w-7xl mx-auto w-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* MOBILE/TABLET LAYOUT (<lg) */}
            <div className="lg:hidden">
                <MobileLayout
                    navItems={mobileNavItems}
                    title="Panel Admin"
                    showNav={true}
                />
            </div>
        </>
    );
}
