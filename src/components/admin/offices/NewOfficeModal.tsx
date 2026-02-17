import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useOfficeStore } from "@/stores/officeStore";

const officeSchema = z.object({
    name: z.string().min(3, "Nombre requerido"),
    city: z.string().min(2, "Ciudad requerida"),
    address: z.string().min(5, "Dirección requerida"),
    phone: z.string().min(7, "Teléfono requerido"),
    manager: z.string().min(3, "Encargado requerido"),
    status: z.enum(["active", "inactive"]),
});

type OfficeFormValues = z.infer<typeof officeSchema>;

export function NewOfficeModal() {
    const [open, setOpen] = useState(false);
    const { createOffice } = useOfficeStore();

    const form = useForm<OfficeFormValues>({
        resolver: zodResolver(officeSchema),
        defaultValues: {
            status: "active",
            city: "Oruro"
        }
    });

    const onSubmit = async (data: OfficeFormValues) => {
        try {
            await createOffice(data);
            toast.success("Oficina registrada exitosamente");
            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Error al registrar oficina");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Building2 className="mr-2 h-4 w-4" />
                    Nueva Oficina
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Registrar Nueva Oficina
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre de Oficina</Label>
                        <Input id="name" {...form.register("name")} placeholder="Ej: Sucursal Centro" />
                        {form.formState.errors.name && <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Select onValueChange={(val) => form.setValue("city", val)} defaultValue="Oruro">
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione ciudad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Oruro">Oruro</SelectItem>
                                    <SelectItem value="La Paz">La Paz</SelectItem>
                                    <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                                    <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                                    <SelectItem value="Potosí">Potosí</SelectItem>
                                    <SelectItem value="Sucre">Sucre</SelectItem>
                                    <SelectItem value="Tarija">Tarija</SelectItem>
                                    <SelectItem value="Beni">Beni</SelectItem>
                                    <SelectItem value="Pando">Pando</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.city && <span className="text-xs text-destructive">{form.formState.errors.city.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" {...form.register("phone")} placeholder="2-5200000" />
                            {form.formState.errors.phone && <span className="text-xs text-destructive">{form.formState.errors.phone.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" {...form.register("address")} placeholder="Calle Principal #123" />
                        {form.formState.errors.address && <span className="text-xs text-destructive">{form.formState.errors.address.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manager">Encargado</Label>
                            <Input id="manager" {...form.register("manager")} placeholder="Nombre del responsable" />
                            {form.formState.errors.manager && <span className="text-xs text-destructive">{form.formState.errors.manager.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select onValueChange={(val) => form.setValue("status", val as any)} defaultValue="active">
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activa</SelectItem>
                                    <SelectItem value="inactive">Inactiva</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar Oficina</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
