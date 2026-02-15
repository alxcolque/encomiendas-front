import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClaimsPage() {
    return (
        <div className="container py-12 max-w-3xl">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-display font-bold">Libro de Reclamaciones</h1>
                <p className="text-muted-foreground text-lg">
                    Lamentamos los inconvenientes. Por favor complete el formulario para registrar su reclamo.
                </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <Input placeholder="Juan Pérez" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Carnet de Identidad</label>
                            <Input placeholder="1234567 LP" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input placeholder="77712345" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="juan@ejemplo.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Código de Envío (Opcional)</label>
                        <Input placeholder="ENV-2025-001" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Detalle del Reclamo</label>
                        <Textarea
                            placeholder="Describa los hechos detalladamente..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <Button className="w-full" size="lg" variant="destructive">
                        Registrar Reclamo
                    </Button>

                    <p className="text-xs text-muted-foreground text-center pt-4">
                        Su reclamo será atendido en un plazo máximo de 7 días hábiles conforme a normativa vigente.
                    </p>
                </form>
            </div>
        </div>
    );
}
