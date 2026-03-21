import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, User as UserIcon } from "lucide-react";
import { LoadingLogo } from "@/components/shared/LoadingLogo";
import { toast } from "sonner";
import { useDriverStore } from "@/stores/driverStore";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Driver } from "@/interfaces/driver.interface";
import { AdminUser } from "@/interfaces/user.interface";

// Schema base
const baseSchema = z.object({
    user_id: z.string().optional(), // Required for create, ignored/hidden for edit
    vehicle_type: z.string().min(2, "Tipo de vehículo requerido"),
    plate_number: z.string().min(5, "Placa requerida"),
    license_number: z.string().min(5, "Licencia requerida"),
    status: z.enum(["active", "inactive", "on-delivery"]),
});

// Create Schema
const createSchema = baseSchema.extend({
    user_id: z.string().min(1, "Debe seleccionar un usuario"),
});

// Edit Schema
const editSchema = baseSchema;

type DriverFormValues = z.infer<typeof createSchema>;

interface DriverModalProps {
    driverToEdit?: Driver | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DriverModal({ driverToEdit, open, onOpenChange }: DriverModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createDriver, updateDriver } = useDriverStore();
    const { users, getUsers } = useUserStore();
    const isEditing = !!driverToEdit;

    const form = useForm<DriverFormValues>({
        resolver: zodResolver(isEditing ? editSchema : createSchema),
        defaultValues: {
            status: "active",
            vehicle_type: "Motocicleta",
        }
    });

    useEffect(() => {
        if (open) {
            getUsers(); // Fetch latest users
            if (driverToEdit) {
                form.reset({
                    user_id: driverToEdit.user_id ? String(driverToEdit.user_id) : "", // Though usually not editable
                    vehicle_type: driverToEdit.vehicle_type,
                    plate_number: driverToEdit.plate_number,
                    license_number: driverToEdit.license_number,
                    status: driverToEdit.status as "active" | "inactive" | "on-delivery",
                });
            } else {
                form.reset({
                    user_id: "",
                    vehicle_type: "Motocicleta",
                    plate_number: "",
                    license_number: "",
                    status: "active",
                });
            }
        }
    }, [open, driverToEdit, form, getUsers]);

    // Filter users who are not already drivers? 
    // Ideally backend should provide this, but for now check if user has 'driver' role or simple allow all non-admin?
    // Let's list all users for now, or maybe filter those with role 'user' or 'admin' who are not yet drivers?
    // Simplifying: List all active users.
    const availableUsers = users;

    const onSubmit = async (data: DriverFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditing && driverToEdit) {
                await updateDriver(driverToEdit.id, data);
                toast.success("Conductor actualizado exitosamente");
            } else {
                await createDriver(data);
                toast.success("Conductor asignado exitosamente");
            }
            onOpenChange(false);
        } catch (error: any) {
            const action = isEditing ? "actualizar" : "registrar";
            toast.error(`Error al ${action} conductor`, {
                description: error.response?.data?.message || "Ocurrió un error inesperado"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? <Truck className="h-5 w-5 text-primary" /> : <Truck className="h-5 w-5 text-primary" />}
                        {isEditing ? `Editar Conductor: ${driverToEdit?.name}` : "Asignar Nuevo Conductor"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

                    {/* User Selection (Only for Create) */}
                    {!isEditing && (
                        <div className="space-y-2">
                            <Label htmlFor="user_id">Usuario a Asignar</Label>
                            <Select
                                onValueChange={(val) => form.setValue("user_id", val)}
                                value={form.watch("user_id")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un usuario existente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{user.name} ({user.email})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.user_id && <span className="text-xs text-destructive">{form.formState.errors.user_id.message}</span>}
                        </div>
                    )}

                    {/* Vehicle Info */}
                    <div className="space-y-4 pt-2 border-t border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            Datos del Vehículo
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_type">Tipo de Vehículo</Label>
                                <Select
                                    onValueChange={(val) => form.setValue("vehicle_type", val)}
                                    defaultValue={isEditing ? driverToEdit?.vehicle_type : "Motocicleta"}
                                    value={form.watch("vehicle_type")}
                                >
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
                                {form.formState.errors.vehicle_type && <span className="text-xs text-destructive">{form.formState.errors.vehicle_type.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plate_number">Placa</Label>
                                <Input id="plate_number" {...form.register("plate_number")} placeholder="1234-ABC" className="uppercase" />
                                {form.formState.errors.plate_number && <span className="text-xs text-destructive">{form.formState.errors.plate_number.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="license_number">Licencia de Conducir</Label>
                                <Input id="license_number" {...form.register("license_number")} placeholder="Licencia ID" />
                                {form.formState.errors.license_number && <span className="text-xs text-destructive">{form.formState.errors.license_number.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Estado</Label>
                                <Select
                                    onValueChange={(val) => form.setValue("status", val as any)}
                                    defaultValue={isEditing ? driverToEdit?.status : "active"}
                                    value={form.watch("status")}
                                >
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
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <LoadingLogo className="mr-2 h-4 w-4 animate-pulse" />}
                            {isEditing ? "Actualizar Conductor" : "Asignar Conductor"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
