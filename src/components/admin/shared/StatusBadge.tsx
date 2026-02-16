import { cn } from "@/lib/utils";
import { ShipmentStatus } from "@/interfaces/admin/dashboard.interface";

interface StatusBadgeProps {
    status: ShipmentStatus | string;
    className?: string;
}

const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    in_transit: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    cancelled: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",

    // Driver Statuses
    available: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    busy: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    offline: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    in_transit: "En Tránsito",
    delivered: "Entregado",
    cancelled: "Cancelado",
    available: "Disponible",
    busy: "Ocupado",
    offline: "Desconectado",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();
    const style = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-700 border-gray-200";
    const label = statusLabels[normalizedStatus] || status;

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border inline-flex items-center justify-center whitespace-nowrap",
            style,
            className
        )}>
            {label}
        </span>
    );
}
