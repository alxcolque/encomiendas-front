import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, User } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

const userSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Celular requerido"),
    role: z.enum(["admin", "worker", "driver", "client"]),
    status: z.enum(["active", "inactive"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export function NewUserModal() {
    const [open, setOpen] = useState(false);
    const { createUser } = useUserStore();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "client",
            status: "active",
        }
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            await createUser(data);
            toast.success("Usuario creado exitosamente");
            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Error al crear usuario");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Registrar Nuevo Usuario
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select onValueChange={(val) => form.setValue("role", val as any)} defaultValue="client">
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="worker">Operador</SelectItem>
                                    <SelectItem value="driver">Conductor</SelectItem>
                                    <SelectItem value="client">Cliente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select onValueChange={(val) => form.setValue("status", val as any)} defaultValue="active">
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar Usuario</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
