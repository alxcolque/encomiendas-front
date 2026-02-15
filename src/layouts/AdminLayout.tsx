import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { LayoutDashboard, Users, Package, Settings } from "lucide-react";

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Panel", path: "/admin" },
    { icon: Users, label: "Usuarios", path: "/admin/users" },
    { icon: Package, label: "Envíos", path: "/admin/shipments" },
    { icon: Settings, label: "Ajustes", path: "/admin/settings" },
];

export default function AdminLayout() {
    return <MobileLayout navItems={navItems} title="Admin Panel" />;
}
