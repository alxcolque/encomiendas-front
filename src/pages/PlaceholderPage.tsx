import { GlassCard } from "@/components/ui/GlassCard";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="p-4">
            <GlassCard>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-muted-foreground mt-2">Página en construcción.</p>
            </GlassCard>
        </div>
    );
}
