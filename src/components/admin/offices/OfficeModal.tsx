import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useOfficeStore } from "@/stores/officeStore";
import { Office } from "@/interfaces/office.interface";
import { useUserStore } from "@/stores/userStore";
import { useCityStore } from "@/stores/cityStore";
import { MultiSelect } from "@/components/ui/multi-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const officeSchema = z.object({
    name: z.string().min(3, "Nombre requerido"),
    city_id: z.string().min(1, "Ciudad requerida"),
    address: z.string().min(5, "Dirección requerida"),
    users: z.array(z.string()).optional(),
    status: z.enum(["active", "inactive"]),
    coordinates: z.string().optional(),
    image: z.string().optional(),
});

type OfficeFormValues = z.infer<typeof officeSchema>;

interface OfficeModalProps {
    officeToEdit?: Office | null;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function OfficeModal({ officeToEdit, trigger, open: controlledOpen, onOpenChange }: OfficeModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createOffice, updateOffice } = useOfficeStore();
    const { users, getUsers } = useUserStore();
    const { cities, fetchCities } = useCityStore();

    const isControlled = typeof controlledOpen !== "undefined";
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange : setInternalOpen;

    const isEditing = !!officeToEdit;

    const form = useForm<OfficeFormValues>({
        resolver: zodResolver(officeSchema),
        defaultValues: {
            status: "active",
            city_id: "",
            users: []
        }
    });

    useEffect(() => {
        if (open) {
            getUsers();
            fetchCities();
            if (officeToEdit) {
                form.reset({
                    name: officeToEdit.name,
                    city_id: String(officeToEdit.city_id || officeToEdit.city?.id || ""),
                    address: officeToEdit.address,
                    users: officeToEdit.managers?.map(m => String(m.id)) || [],
                    status: officeToEdit.status,
                    coordinates: officeToEdit.coordinates || "",
                    image: undefined,
                });
                setImagePreview(officeToEdit.image || null);
            } else {
                form.reset({
                    name: "",
                    city_id: "",
                    address: "",
                    users: [],
                    status: "active",
                    coordinates: "",
                    image: undefined,
                });
                setImagePreview(null);
            }
        }
    }, [open, officeToEdit, form, getUsers, fetchCities]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImagePreview(base64);
                form.setValue("image", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: OfficeFormValues) => {
        setIsSubmitting(true);
        const payload = {
            name: data.name,
            city_id: data.city_id,
            address: data.address,
            status: data.status,
            users: data.users,
            coordinates: data.coordinates,
            image: data.image,
        };
        try {
            if (isEditing && officeToEdit) {
                await updateOffice(officeToEdit.id, payload);
                toast.success("Oficina actualizada correctamente");
            } else {
                await createOffice(payload);
                toast.success("Oficina registrada exitosamente");
            }
            setOpen?.(false);
            if (!isEditing) form.reset();
        } catch (error: any) {
            const action = isEditing ? "actualizar" : "registrar";
            toast.error(`Error al ${action} oficina`, {
                description: error.response?.data?.message || "Ocurrió un error inesperado"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const managerOptions = users
        .filter(u => ['admin', 'worker'].includes(u.role))
        .map(u => {
            const currentOffice = u.offices && u.offices.length > 0 ? ` - ${u.offices[0].name}` : '';
            return {
                value: String(u.id),
                label: `${u.name} (${u.role})${currentOffice}`
            };
        });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

            <DialogContent className="sm:max-w-lg backdrop-blur-xl border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {isEditing ? "Editar Oficina" : "Registrar Nueva Oficina"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4" /> Información General
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="image_office" className="cursor-pointer">
                                        <Avatar className="h-20 w-20 border-2 border-dashed border-primary/30 hover:border-primary transition-all rounded-2xl">
                                            <AvatarImage src={imagePreview || ""} />
                                            <AvatarFallback className="rounded-2xl">
                                                {isEditing ? <Building2 className="h-8 w-8 text-primary/40" /> : <ImagePlus className="h-8 w-8 text-primary/40" />}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Label>
                                    <Input
                                        id="image_office"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <span className="text-xs text-muted-foreground">Foto (opcional)</span>
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <Label htmlFor="name">Nombre de Oficina <span className="text-destructive">*</span></Label>
                                    <Input id="name" {...form.register("name")} placeholder="Ej: Sucursal Centro" />
                                    {form.formState.errors.name && <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city_id">Ciudad <span className="text-destructive">*</span></Label>
                                    <Select
                                        onValueChange={(val) => form.setValue("city_id", val)}
                                        value={form.watch("city_id")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione ciudad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={String(city.id)}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.city_id && <span className="text-xs text-destructive">{form.formState.errors.city_id.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select
                                        onValueChange={(val) => form.setValue("status", val as any)}
                                        defaultValue={isEditing ? officeToEdit?.status : "active"}
                                        value={form.watch("status")}
                                    >
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
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección <span className="text-destructive">*</span></Label>
                                <Input id="address" {...form.register("address")} placeholder="Calle Principal #123" />
                                {form.formState.errors.address && <span className="text-xs text-destructive">{form.formState.errors.address.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coordinates">Coordenadas (Lat, Lng) <span className="text-xs text-muted-foreground">(Opcional)</span></Label>
                                <Input id="coordinates" {...form.register("coordinates")} placeholder="-17.9647, -67.1060" />
                                <p className="text-[10px] text-muted-foreground">Útil para mostrar en mapas.</p>
                            </div>
                        </div>

                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4" /> Encargados
                            </h3>
                            <div className="space-y-2">
                                <Label>Seleccionar Encargados</Label>
                                <MultiSelect
                                    options={managerOptions}
                                    selected={form.watch("users") || []}
                                    onChange={(values) => form.setValue("users", values)}
                                    placeholder="Buscar usuarios..."
                                    className="w-full"
                                />
                                <p className="text-[10px] text-muted-foreground">Solo se muestran usuarios con rol Admin o Worker.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen?.(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Actualizar Oficina" : "Guardar Oficina"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
