import { MobileLayout, NavItem } from "@/components/layout/MobileLayout";
import { Home, Package, Trophy, Wallet, User } from "lucide-react";

const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/driver" },
    { icon: Package, label: "Activo", path: "/driver/active" },
    { icon: Trophy, label: "Ranking", path: "/driver/ranking" },
    { icon: Wallet, label: "Billetera", path: "/driver/wallet" },
    { icon: User, label: "Perfil", path: "/user/profile" }, // Shared profile
];

export default function DriverLayout() {
    return <MobileLayout navItems={navItems} />;
}
