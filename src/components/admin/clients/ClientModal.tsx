import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useClientStore } from '@/stores/clientStore';
import { Client } from '@/interfaces/client.interface';

const schema = z.object({
    name: z.string().min(2, 'El nombre es requerido'),
    ci_nit: z.string().min(1, 'El CI/NIT es requerido'),
    phone: z.string().optional(),
    status: z.enum(['normal', 'blocked', 'deleted']),
    observations: z.string().optional(),
});

type ClientFormValues = z.infer<typeof schema>;

interface ClientModalProps {
    clientToEdit?: Client | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClientModal({ clientToEdit, open, onOpenChange }: ClientModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createClient, updateClient } = useClientStore();
    const isEditing = !!clientToEdit;

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            ci_nit: '',
            phone: '',
            status: 'normal',
            observations: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (clientToEdit) {
                form.reset({
                    name: clientToEdit.name,
                    ci_nit: clientToEdit.ci_nit,
                    phone: clientToEdit.phone ?? '',
                    status: clientToEdit.status,
                    observations: clientToEdit.observations ?? '',
                });
            } else {
                form.reset({
                    name: '',
                    ci_nit: '',
                    phone: '',
                    status: 'normal',
                    observations: '',
                });
            }
        }
    }, [open, clientToEdit, form]);

    const onSubmit = async (values: ClientFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditing && clientToEdit) {
                await updateClient(clientToEdit.id, values);
            } else {
                await createClient(values);
            }
            onOpenChange(false);
        } catch (error: any) {
            const action = isEditing ? 'actualizar' : 'registrar';
            toast.error(`Error al ${action} cliente`, {
                description:
                    error.response?.data?.errors
                        ? Object.values(error.response.data.errors).flat().join(' ')
                        : error.response?.data?.message || 'Ocurrió un error inesperado',
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
                        <UserCheck className="h-5 w-5 text-primary" />
                        {isEditing ? `Editar Cliente: ${clientToEdit?.name}` : 'Nuevo Cliente'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* Nombre y CI/NIT */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                {...form.register('name')}
                                placeholder="Juan Pérez"
                            />
                            {form.formState.errors.name && (
                                <span className="text-xs text-destructive">
                                    {form.formState.errors.name.message}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ci_nit">CI / NIT</Label>
                            <Input
                                id="ci_nit"
                                {...form.register('ci_nit')}
                                placeholder="1234567"
                            />
                            {form.formState.errors.ci_nit && (
                                <span className="text-xs text-destructive">
                                    {form.formState.errors.ci_nit.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Teléfono y Estado */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                {...form.register('phone')}
                                placeholder="77712345"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                                onValueChange={(val) =>
                                    form.setValue('status', val as ClientFormValues['status'])
                                }
                                value={form.watch('status')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="blocked">Bloqueado</SelectItem>
                                    <SelectItem value="deleted">Eliminado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea
                            id="observations"
                            {...form.register('observations')}
                            placeholder="Información adicional sobre el cliente..."
                            rows={3}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <div className={`loading-logo ${"mr-2 h-4 w-4 animate-pulse"}`}></div>}
                            {isEditing ? 'Actualizar Cliente' : 'Registrar Cliente'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
