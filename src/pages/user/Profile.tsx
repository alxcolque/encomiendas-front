import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/authStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, LogOut, Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Profile Schema
const profileSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Celular requerido"),
    avatar: z.string().optional(),
});

// PIN Schema
const pinSchema = z.object({
    current_pin: z.string().length(4, "PIN actual debe tener 4 dígitos"),
    pin: z.string().length(4, "Nuevo PIN debe tener 4 dígitos"),
    pin_confirmation: z.string().length(4, "Confirmación debe tener 4 dígitos"),
}).refine((data) => data.pin === data.pin_confirmation, {
    message: "Los PINs no coinciden",
    path: ["pin_confirmation"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PinFormValues = z.infer<typeof pinSchema>;

export default function ProfilePage() {
    const { user, logout, updateProfile, changePin } = useAuthStore();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPin, setIsSubmittingPin] = useState(false);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        },
    });

    const pinForm = useForm<PinFormValues>({
        resolver: zodResolver(pinSchema),
        defaultValues: {
            current_pin: "",
            pin: "",
            pin_confirmation: "",
        },
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                profileForm.setValue("avatar", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const onProfileSubmit = async (values: ProfileFormValues) => {
        setIsSubmittingProfile(true);
        try {
            await updateProfile(values as any);
            // toast success handled in store
        } catch (error) {
            // error handled in store
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const onPinSubmit = async (values: PinFormValues) => {
        setIsSubmittingPin(true);
        try {
            await changePin(values as any);
            pinForm.reset();
        } catch (error) {
            // error handled in store
        } finally {
            setIsSubmittingPin(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 pb-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Panel: Avatar & Basic Info */}
                <div className="md:w-1/3 space-y-6">
                    <GlassCard className="flex flex-col items-center py-8 text-center sticky top-24">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-primary/20 transition-transform group-hover:scale-105">
                                <AvatarImage src={avatarPreview || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                                    <UserIcon size={48} />
                                </AvatarFallback>
                            </Avatar>
                            <Label
                                htmlFor="avatar-upload"
                                className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
                            >
                                <Camera size={18} />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </Label>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-muted-foreground capitalize font-medium">{user?.role}</p>
                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Conectado
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            className="mt-8 w-full max-w-[200px] border-destructive/50 text-destructive hover:bg-destructive/10"
                            onClick={logout}
                        >
                            <LogOut size={16} className="mr-2" />
                            Cerrar Sesión
                        </Button>
                    </GlassCard>
                </div>

                {/* Right Panel: Edit Sections */}
                <div className="md:w-2/3 space-y-6">
                    {/* Person Information */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <UserIcon size={20} />
                            <h3 className="text-lg font-bold">Información Personal</h3>
                        </div>

                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input
                                        id="name"
                                        {...profileForm.register("name")}
                                        className={profileForm.formState.errors.name ? "border-destructive" : ""}
                                    />
                                    {profileForm.formState.errors.name && (
                                        <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Número de Celular</Label>
                                    <Input
                                        id="phone"
                                        {...profileForm.register("phone")}
                                        className={profileForm.formState.errors.phone ? "border-destructive" : ""}
                                    />
                                    {profileForm.formState.errors.phone && (
                                        <p className="text-xs text-destructive">{profileForm.formState.errors.phone.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...profileForm.register("email")}
                                    className={profileForm.formState.errors.email ? "border-destructive" : ""}
                                />
                                {profileForm.formState.errors.email && (
                                    <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isSubmittingProfile}>
                                    {isSubmittingProfile ? (
                                        <div className={`loading-logo ${"mr-2 h-4 w-4 animate-pulse"}`}></div>
                                    ) : null}
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </GlassCard>

                    {/* Security / Change PIN */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <ShieldCheck size={20} />
                            <h3 className="text-lg font-bold">Seguridad</h3>
                        </div>

                        <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_pin">PIN Actual</Label>
                                    <Input
                                        id="current_pin"
                                        type="password"
                                        maxLength={4}
                                        placeholder="****"
                                        {...pinForm.register("current_pin")}
                                        className={pinForm.formState.errors.current_pin ? "border-destructive" : ""}
                                    />
                                    {pinForm.formState.errors.current_pin && (
                                        <p className="text-xs text-destructive">{pinForm.formState.errors.current_pin.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pin">Nuevo PIN</Label>
                                    <Input
                                        id="pin"
                                        type="password"
                                        maxLength={4}
                                        placeholder="****"
                                        {...pinForm.register("pin")}
                                        className={pinForm.formState.errors.pin ? "border-destructive" : ""}
                                    />
                                    {pinForm.formState.errors.pin && (
                                        <p className="text-xs text-destructive">{pinForm.formState.errors.pin.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pin_confirmation">Confirmar PIN</Label>
                                    <Input
                                        id="pin_confirmation"
                                        type="password"
                                        maxLength={4}
                                        placeholder="****"
                                        {...pinForm.register("pin_confirmation")}
                                        className={pinForm.formState.errors.pin_confirmation ? "border-destructive" : ""}
                                    />
                                    {pinForm.formState.errors.pin_confirmation && (
                                        <p className="text-xs text-destructive">{pinForm.formState.errors.pin_confirmation.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    disabled={isSubmittingPin}
                                    className="bg-secondary/20 hover:bg-secondary/30"
                                >
                                    {isSubmittingPin ? (
                                        <div className={`loading-logo ${"mr-2 h-4 w-4 animate-pulse"}`}></div>
                                    ) : null}
                                    Cambiar PIN
                                </Button>
                            </div>
                        </form>
                    </GlassCard>

                    {/* Danger Zone */}
                    <GlassCard className="p-6 border-destructive/20 bg-destructive/5">
                        <div className="flex items-center gap-2 mb-4 text-destructive">
                            <ShieldCheck size={20} />
                            <h3 className="text-lg font-bold">Zona de Peligro</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Si eliminas tu cuenta, todos tus datos personales serán borrados o anonimizados. Esta acción es irreversible.
                        </p>
                        <div className="flex justify-start">
                            <Button 
                                variant="link" 
                                className="text-destructive hover:text-destructive/80 p-0 h-auto font-medium"
                                onClick={() => window.location.href = "/user/profile/delete-me"}
                            >
                                Deseo eliminar mi cuenta definitivamente
                            </Button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
