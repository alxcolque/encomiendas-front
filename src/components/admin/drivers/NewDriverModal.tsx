import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useDriverStore } from "@/stores/driverStore";

const driverSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Celular requerido"),
    licenseNumber: z.string().min(5, "Licencia requerida"),
    vehicleType: z.string().min(2, "Tipo de vehículo requerido"),
    plateNumber: z.string().min(5, "Placa requerida"),
    status: z.enum(["active", "inactive", "on-delivery"]),
});

type DriverFormValues = z.infer<typeof driverSchema>;

export function NewDriverModal() {
    const [open, setOpen] = useState(false);
    const { createDriver } = useDriverStore();

    const form = useForm<DriverFormValues>({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            status: "active",
            vehicleType: "Motocicleta"
        }
    });

    const onSubmit = async (data: DriverFormValues) => {
        try {
            await createDriver(data);
            toast.success("Conductor registrado exitosamente");
            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Error al registrar conductor");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Truck className="mr-2 h-4 w-4" />
                    Nuevo Conductor
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Registrar Nuevo Conductor
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Datos Personales</h3>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" {...form.register("name")} placeholder="Juan Pérez" />
                            {form.formState.errors.name && <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...form.register("email")} placeholder="juan@ejemplo.com" />
                                {form.formState.errors.email && <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Celular</Label>
                                <Input id="phone" {...form.register("phone")} placeholder="70000000" />
                                {form.formState.errors.phone && <span className="text-xs text-destructive">{form.formState.errors.phone.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="space-y-4 pt-2 border-t border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            Datos del Vehículo
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
                                <Select onValueChange={(val) => form.setValue("vehicleType", val)} defaultValue="Motocicleta">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                                        <SelectItem value="Automóvil">Automóvil</SelectItem>
                                        <SelectItem value="Camioneta">Camioneta</SelectItem>
                                        <SelectItem value="Camión">Camión</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.vehicleType && <span className="text-xs text-destructive">{form.formState.errors.vehicleType.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plateNumber">Placa</Label>
                                <Input id="plateNumber" {...form.register("plateNumber")} placeholder="1234-ABC" className="uppercase" />
                                {form.formState.errors.plateNumber && <span className="text-xs text-destructive">{form.formState.errors.plateNumber.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">Licencia de Conducir</Label>
                                <Input id="licenseNumber" {...form.register("licenseNumber")} placeholder="Licencia ID" />
                                {form.formState.errors.licenseNumber && <span className="text-xs text-destructive">{form.formState.errors.licenseNumber.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado Inicial</Label>
                                <Select onValueChange={(val) => form.setValue("status", val as any)} defaultValue="active">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Activo (Disponible)</SelectItem>
                                        <SelectItem value="inactive">Inactivo</SelectItem>
                                        <SelectItem value="on-delivery">En Ruta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar Conductor</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
