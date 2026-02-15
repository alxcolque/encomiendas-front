import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { LayoutDashboard, Box, Scan } from "lucide-react";

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Panel", path: "/worker" },
    { icon: Box, label: "Registrar", path: "/worker/register" },
    { icon: Scan, label: "Escanear", path: "/worker/scan" },
];

export default function WorkerLayout() {
    return <MobileLayout navItems={navItems} title="Operador" />;
}
