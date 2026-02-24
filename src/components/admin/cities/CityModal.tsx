import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCityStore } from "@/stores/cityStore";
import { City } from "@/interfaces/city.interface";

const citySchema = z.object({
    name: z.string().min(2, "Nombre requerido (mín. 2 caracteres)"),
    location: z.string().max(250).optional().or(z.literal("")),
});

type CityFormValues = z.infer<typeof citySchema>;

interface CityModalProps {
    cityToEdit?: City | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CityModal({ cityToEdit, open, onOpenChange }: CityModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createCity, updateCity } = useCityStore();
    const isEditing = !!cityToEdit;

    const form = useForm<CityFormValues>({
        resolver: zodResolver(citySchema),
        defaultValues: { name: "", location: "" },
    });

    useEffect(() => {
        if (open) {
            if (cityToEdit) {
                form.reset({
                    name: cityToEdit.name,
                    location: cityToEdit.location || "",
                });
            } else {
                form.reset({ name: "", location: "" });
            }
        }
    }, [open, cityToEdit, form]);

    const onSubmit = async (data: CityFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditing && cityToEdit) {
                await updateCity(cityToEdit.id, data);
                toast.success("Ciudad actualizada correctamente");
            } else {
                await createCity(data as Omit<City, "id">);
                toast.success("Ciudad registrada exitosamente");
            }
            onOpenChange(false);
        } catch (error: any) {
            toast.error(isEditing ? "Error al actualizar ciudad" : "Error al registrar ciudad", {
                description: error.response?.data?.message || "Ocurrió un error inesperado",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {isEditing ? "Editar Ciudad" : "Nueva Ciudad"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nombre <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                placeholder="Ej: La Paz"
                                autoFocus
                            />
                            {form.formState.errors.name && (
                                <span className="text-xs text-destructive">
                                    {form.formState.errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">
                                Ubicación{" "}
                                <span className="text-xs text-muted-foreground">(Opcional)</span>
                            </Label>
                            <Input
                                id="location"
                                {...form.register("location")}
                                placeholder="Ej: -16.5000, -68.1193"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Coordenadas o descripción de ubicación.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Actualizar Ciudad" : "Guardar Ciudad"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
