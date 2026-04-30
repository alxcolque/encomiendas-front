import { cn } from "@/lib/utils";
import { ShipmentStatus } from "@/interfaces/admin/dashboard.interface";

interface StatusBadgeProps {
    status: ShipmentStatus | string;
    secondaryLabel?: string;
    className?: string;
}

const statusStyles: Record<string, string> = {
    in_transit: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    created: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    at_office: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",

    // Driver Statuses
    available: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    busy: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    offline: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const statusLabels: Record<string, string> = {
    in_transit: "En Tránsito",
    delivered: "Entregado",
    created: "Creado",
    quote: "Cotizado",
    at_office: "En Sucursal",
    available: "Disponible",
    busy: "Ocupado",
    offline: "Desconectado",
};

export function StatusBadge({ status, secondaryLabel, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();
    const style = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-700 border-gray-200";
    const label = statusLabels[normalizedStatus] || status;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border inline-flex items-center justify-center whitespace-nowrap",
                style,
                className
            )}>
                {label}
            </span>
            {secondaryLabel && (
                <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-flex items-center justify-center whitespace-nowrap",
                    secondaryLabel.toLowerCase() === 'pagado'
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : secondaryLabel.toLowerCase() === 'por pagar'
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                )}>
                    {secondaryLabel}
                </span>
            )}
        </div>
    );
}
