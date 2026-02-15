import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, Box } from "lucide-react";

export default function WorkerDashboard() {
    return (
        <div className="p-4 space-y-6">
            <GlassCard>
                <h2 className="text-xl font-bold mb-4">Panel de Operador</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button className="h-24 flex-col gap-2" variant="outline" onClick={() => window.location.href = '/worker/scan'}>
                        <Scan size={32} />
                        <span>Escanear QR</span>
                    </Button>
                    <Button className="h-24 flex-col gap-2" variant="outline" onClick={() => window.location.href = '/worker/register'}>
                        <Box size={32} />
                        <span>Registrar Envío</span>
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}
