import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { Home, Package, Wallet, User } from "lucide-react";

const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/user" },
    { icon: Package, label: "Mis Envíos", path: "/user/shipments" },
    { icon: Wallet, label: "Pagos", path: "/user/wallet" },
    { icon: User, label: "Perfil", path: "/user/profile" },
];

export default function UserLayout() {
    return <MobileLayout navItems={navItems} title="Usuario" />;
}
