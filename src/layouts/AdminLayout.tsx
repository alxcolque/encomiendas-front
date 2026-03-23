import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { AdminSidebar } from "@/components/admin/navigation/AdminSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Package, Settings, Plus } from "lucide-react";
import { NewShipmentModal } from "@/components/shared/NewShipmentModal";
import { ADMIN_ROUTES } from "@/constants/admin.routes";
import { useAuthStore } from "@/stores/authStore";

const mobileNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Panel", path: ADMIN_ROUTES.DASHBOARD },
    { icon: Package, label: "Envíos", path: ADMIN_ROUTES.SHIPMENTS },
    { icon: Users, label: "Usuarios", path: ADMIN_ROUTES.USERS },
    { icon: Settings, label: "Ajustes", path: ADMIN_ROUTES.SETTINGS },
];

export default function AdminLayout() {
    const { user } = useAuthStore();
    const role = user?.role || 'client';
    const isAdmin = role === 'admin';

    const filteredNavItems = mobileNavItems.filter(item => {
        if (item.path === ADMIN_ROUTES.USERS) return isAdmin;
        if (item.path === ADMIN_ROUTES.SETTINGS) return isAdmin;
        return true;
    });

    return (
        <>
            {/* DESKTOP LAYOUT (lg+) */}
            <div className="hidden lg:flex min-h-screen bg-background">
                {/* Fixed Sidebar */}
                <AdminSidebar className="print:hidden" />

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-64 print:ml-0 flex flex-col min-h-screen transition-all duration-300">
                    <TopNavbar className="print:hidden" />
                    <main className="flex-1 overflow-y-auto">
                        <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 print:max-w-full print:p-0">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* MOBILE/TABLET LAYOUT (<lg) */}
            <div className="lg:hidden">
                <MobileLayout
                    navItems={filteredNavItems}
                    title="Panel Admin"
                    showNav={true}
                    centerAction={
                        <NewShipmentModal
                            trigger={
                                <button
                                    type="button"
                                    className="flex flex-col items-center min-w-fit gap-1 group transition-all px-2 active:scale-95"
                                >
                                    <div className="p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/40 ring-4 ring-primary/20">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-primary whitespace-nowrap">
                                        Nuevo
                                    </span>
                                </button>
                            }
                        />
                    }
                />
            </div>
        </>
    );
}
