import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { ReactNode } from "react";

interface AdminSectionHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export function AdminSectionHeader({ title, subtitle, actions }: AdminSectionHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
