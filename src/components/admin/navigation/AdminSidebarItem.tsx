import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AdminSidebarItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    isCollapsed?: boolean;
}

export function AdminSidebarItem({ icon: Icon, label, path, isCollapsed }: AdminSidebarItemProps) {
    const location = useLocation();
    // Check if current path matches EXACTLY for dashboard root, or STARTS WITH for sub-sections
    const isActive = path === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(path);

    return (
        <Link
            to={path}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={isCollapsed ? label : undefined}
        >
            <Icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />

            {!isCollapsed && (
                <span className="truncate text-sm">{label}</span>
            )}

            {isActive && !isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
            )}
        </Link>
    );
}
