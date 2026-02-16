import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Package, Truck, User, MapPin, Calculator, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Schema Validation
const shipmentSchema = z.object({
    // Sender
    senderName: z.string().min(2, "Nombre requerido"),
    senderId: z.string().min(4, "Carnet requerido"),
    senderPhone: z.string().min(8, "Celular requerido"),

    // Receiver
    receiverName: z.string().min(2, "Nombre requerido"),
    receiverId: z.string().min(4, "Carnet requerido"),
    receiverPhone: z.string().min(8, "Celular requerido"),

    // Shipment Details
    description: z.string().min(5, "Descripción requerida"),
    isFragile: z.enum(["yes", "no"]),
    itemStatus: z.string().min(1, "Estado requerido"),

    // Auto/Route Data
    originCity: z.string().min(2, "Origen requerido"),
    destinationCity: z.string().min(2, "Destino requerido"),
    shippingCost: z.string().min(1, "Costo requerido"), // string for input, parse later
    transportType: z.string().min(1, "Transporte requerido"),

    // Payment
    paymentBy: z.enum(["sender", "receiver"]),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export function NewShipmentModal() {
    const [open, setOpen] = useState(false);

    const form = useForm<ShipmentFormValues>({
        resolver: zodResolver(shipmentSchema),
        defaultValues: {
            isFragile: "no",
            itemStatus: "Nuevo",
            originCity: "Oruro", // Default?
            paymentBy: "sender",
        }
    });

    const onSubmit = (data: ShipmentFormValues) => {
        console.log("Form Data:", data);
        toast.success("Encomienda registrada exitosamente");
        setOpen(false);
        form.reset();
    };

    const currentDate = new Date();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Package className="mr-2 h-5 w-5" />
                    Nueva Encomienda
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-secondary/100 backdrop-blur-3xl border-border/40">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-6 flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-2xl font-display font-bold text-primary flex items-center gap-2">
                            <Package className="h-6 w-6" />
                            Registro de Encomienda
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">Complete los detalles del envío</p>
                    </div>
                    <div className="flex gap-2">
                        {['Día', 'Mes', 'Año'].map((label, i) => (
                            <div key={label} className="flex flex-col items-center">
                                <div className="bg-muted border border-border rounded-md px-3 py-1.5 font-mono text-sm font-medium">
                                    {format(currentDate, i === 0 ? 'dd' : i === 1 ? 'MM' : 'yyyy')}
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase mt-0.5">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">

                    {/* Section 1: Remitente */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold pb-2 border-b border-border/50">
                            <User className="h-4 w-4" />
                            <h3>Sección 1 - Remitente</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="senderName">Nombre Completo</Label>
                                <Input id="senderName" {...form.register("senderName")} className="bg-background/50" placeholder="Juan Pérez" />
                                {form.formState.errors.senderName && <span className="text-xs text-destructive">{form.formState.errors.senderName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="senderId">Carnet de Identidad</Label>
                                <Input id="senderId" {...form.register("senderId")} className="bg-background/50" placeholder="1234567 OR" />
                                {form.formState.errors.senderId && <span className="text-xs text-destructive">{form.formState.errors.senderId.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="senderPhone">Celular</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none text-xs">+591</span>
                                    <Input id="senderPhone" {...form.register("senderPhone")} className="bg-background/50 pl-10" placeholder="70000000" />
                                </div>
                                {form.formState.errors.senderPhone && <span className="text-xs text-destructive">{form.formState.errors.senderPhone.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Destinatario */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold pb-2 border-b border-border/50">
                            <User className="h-4 w-4" />
                            <h3>Sección 2 - Destinatario</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="receiverName">Nombre Completo</Label>
                                <Input id="receiverName" {...form.register("receiverName")} className="bg-background/50" placeholder="María López" />
                                {form.formState.errors.receiverName && <span className="text-xs text-destructive">{form.formState.errors.receiverName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receiverId">Carnet de Identidad</Label>
                                <Input id="receiverId" {...form.register("receiverId")} className="bg-background/50" placeholder="7654321 LP" />
                                {form.formState.errors.receiverId && <span className="text-xs text-destructive">{form.formState.errors.receiverId.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receiverPhone">Celular</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none text-xs">+591</span>
                                    <Input id="receiverPhone" {...form.register("receiverPhone")} className="bg-background/50 pl-10" placeholder="60000000" />
                                </div>
                                {form.formState.errors.receiverPhone && <span className="text-xs text-destructive">{form.formState.errors.receiverPhone.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Declaración del Envío */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold pb-2 border-b border-border/50">
                            <Package className="h-4 w-4" />
                            <h3>Sección 3 - Declaración del Envío</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción del Contenido</Label>
                                <Textarea
                                    id="description"
                                    {...form.register("description")}
                                    className="bg-background/50 min-h-[100px] resize-none"
                                    placeholder="Ej: Ropa, Documentos, Electrónicos..."
                                />
                                {form.formState.errors.description && <span className="text-xs text-destructive">{form.formState.errors.description.message}</span>}
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label>¿Es frágil o delicado?</Label>
                                    <RadioGroup
                                        defaultValue="no"
                                        onValueChange={(val) => form.setValue("isFragile", val as "yes" | "no")}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="fragile-yes" />
                                            <Label htmlFor="fragile-yes" className="cursor-pointer">Si</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="fragile-no" />
                                            <Label htmlFor="fragile-no" className="cursor-pointer">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="itemStatus">Estado del Artículo</Label>
                                    <Select onValueChange={(val) => form.setValue("itemStatus", val)} defaultValue="Nuevo">
                                        <SelectTrigger className="bg-background/50">
                                            <SelectValue placeholder="Seleccione estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nuevo">Nuevo</SelectItem>
                                            <SelectItem value="Usado">Usado</SelectItem>
                                            <SelectItem value="Dañado">Dañado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Datos Automáticos */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold pb-2 border-b border-border/50">
                            <MapPin className="h-4 w-4" />
                            <h3>Sección 4 - Datos de Ruta y Costo</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="originCity">Ciudad de Origen</Label>
                                <Input id="originCity" {...form.register("originCity")} className="bg-background/50" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destinationCity">Ciudad de Destino</Label>
                                <Select onValueChange={(val) => form.setValue("destinationCity", val)}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="Seleccione destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="La Paz">La Paz</SelectItem>
                                        <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                                        <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                                        {/* Add more cities */}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shippingCost">Costo del envío (Bs)</Label>
                                <div className="relative">
                                    <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="shippingCost" {...form.register("shippingCost")} className="bg-background/50 pl-10" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transportType">Transporte</Label>
                                <Select onValueChange={(val) => form.setValue("transportType", val)}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="Seleccione transporte" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bus">Flota / Bus</SelectItem>
                                        <SelectItem value="Camion">Camión</SelectItem>
                                        <SelectItem value="Aereo">Aéreo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Opción de Cancelación */}
                    <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <AlertCircle className="h-4 w-4" />
                            <h3>Sección 5 - Opción de Pago</h3>
                        </div>
                        <RadioGroup
                            defaultValue="sender"
                            onValueChange={(val) => form.setValue("paymentBy", val as "sender" | "receiver")}
                            className="flex gap-8"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sender" id="pay-sender" className="text-primary border-primary" />
                                <Label htmlFor="pay-sender" className="cursor-pointer font-medium">Pagado por Remitente (Origen)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="receiver" id="pay-receiver" className="text-primary border-primary" />
                                <Label htmlFor="pay-receiver" className="cursor-pointer font-medium">Por Pagar (Destino)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" size="xl" variant="hero" className="w-full md:w-auto px-12 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-200">
                            Registrar Encomienda
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
