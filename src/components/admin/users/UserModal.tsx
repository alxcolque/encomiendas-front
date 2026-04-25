import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminUser } from "@/interfaces/user.interface";

// Schema base
const baseSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Celular requerido"),
    role: z.enum(["admin", "worker", "driver", "client", "company", "partner"]),
    status: z.enum(["active", "inactive"]),
    avatar: z.string().optional(),
});

// Create Schema (PIN required)
const createSchema = baseSchema.extend({
    pin: z.string().length(4, "PIN debe tener 4 dígitos"),
});

// Edit Schema (PIN optional)
const editSchema = baseSchema.extend({
    pin: z.string().length(4, "PIN debe tener 4 dígitos").optional().or(z.literal("")),
});

type UserFormValues = z.infer<typeof createSchema>;

interface UserModalProps {
    userToEdit?: AdminUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserModal({ userToEdit, open, onOpenChange }: UserModalProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createUser, updateUser } = useUserStore();
    const isEditing = !!userToEdit;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(isEditing ? editSchema : createSchema),
        defaultValues: {
            role: "worker",
            status: "active",
            pin: "",
        }
    });

    // Reset/Populate form when userToEdit changes
    useEffect(() => {
        if (open) {
            if (userToEdit) {
                form.reset({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    phone: userToEdit.phone || "",
                    role: userToEdit.role,
                    status: userToEdit.status || "active",
                    pin: "", // Don't show PIN
                    avatar: undefined // Don't set base64 unless changed
                });
                setAvatarPreview(userToEdit.avatar || null);
            } else {
                form.reset({
                    name: "",
                    email: "",
                    phone: "",
                    role: "worker",
                    status: "active",
                    pin: "",
                    avatar: undefined
                });
                setAvatarPreview(null);
            }
        }
    }, [open, userToEdit, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatarPreview(base64);
                form.setValue("avatar", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: UserFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditing && userToEdit) {
                await updateUser(userToEdit.id, data);
                toast.success("Usuario actualizado exitosamente");
            } else {
                await createUser(data);
                toast.success("Usuario creado exitosamente");
            }
            onOpenChange(false);
        } catch (error: any) {
            const action = isEditing ? "actualizar" : "crear";
            toast.error(`Error al ${action} usuario`, {
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
                        {isEditing ? <UserIcon className="h-5 w-5 text-primary" /> : <UserPlus className="h-5 w-5 text-primary" />}
                        {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-2">
                            <Label htmlFor="avatar" className="cursor-pointer">
                                <Avatar className="h-20 w-20 border-2 border-dashed border-primary/30 hover:border-primary transition-all rounded-2xl">
                                    <AvatarImage src={avatarPreview || ""} />
                                    <AvatarFallback className="rounded-2xl">
                                        {isEditing ? <UserIcon className="h-8 w-8 text-primary/40" /> : <UserPlus className="h-8 w-8 text-primary/40" />}
                                    </AvatarFallback>
                                </Avatar>
                            </Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <span className="text-xs text-muted-foreground">Foto (opcional)</span>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input id="name" {...form.register("name")} placeholder="Juan Pérez" />
                                {form.formState.errors.name && <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...form.register("email")} placeholder="juan@ejemplo.com" />
                                {form.formState.errors.email && <span className="text-xs text-destructive">{form.formState.errors.email.message}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Celular</Label>
                            <Input id="phone" {...form.register("phone")} placeholder="70000000" />
                            {form.formState.errors.phone && <span className="text-xs text-destructive">{form.formState.errors.phone.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pin">PIN (4 dígitos)</Label>
                            <Input
                                id="pin"
                                type="password"
                                maxLength={4}
                                {...form.register("pin")}
                                placeholder={isEditing ? "Dejar vacío para mantener" : "1234"}
                            />
                            {form.formState.errors.pin && <span className="text-xs text-destructive">{form.formState.errors.pin.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select
                                onValueChange={(val) => form.setValue("role", val as any)}
                                defaultValue={isEditing ? userToEdit?.role : "worker"}
                                value={form.watch("role")} // Controlled value for edit
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="worker">Operador</SelectItem>
                                    <SelectItem value="driver">Conductor</SelectItem>
                                    <SelectItem value="client">Cliente</SelectItem>
                                    <SelectItem value="company">Empresa</SelectItem>
                                    <SelectItem value="partner">Socio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                                onValueChange={(val) => form.setValue("status", val as any)}
                                defaultValue={isEditing ? userToEdit?.status : "active"}
                                value={form.watch("status")}
                            >
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
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <div className={`loading-logo ${"mr-2 h-4 w-4 animate-pulse"}`}></div>}
                            {isEditing ? "Actualizar Usuario" : "Guardar Usuario"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
