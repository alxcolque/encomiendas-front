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
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBusinessStore } from '@/stores/businessStore';
import { Business } from '@/interfaces/business.interface';

const schema = z.object({
    company_name: z.string().min(2, 'El nombre de la empresa es requerido'),
    phone: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(['activo', 'inactivo', 'bloqueado']),
});

type BusinessFormValues = z.infer<typeof schema>;

interface BusinessModalProps {
    businessToEdit?: Business | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BusinessModal({ businessToEdit, open, onOpenChange }: BusinessModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createBusiness, updateBusiness } = useBusinessStore();
    const isEditing = !!businessToEdit;

    const form = useForm<BusinessFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            company_name: '',
            phone: '',
            description: '',
            location: '',
            status: 'activo',
        },
    });

    useEffect(() => {
        if (open) {
            if (businessToEdit) {
                form.reset({
                    company_name: businessToEdit.company_name,
                    phone: businessToEdit.phone ?? '',
                    description: businessToEdit.description ?? '',
                    location: businessToEdit.location ?? '',
                    status: businessToEdit.status,
                });
            } else {
                form.reset({
                    company_name: '',
                    phone: '',
                    description: '',
                    location: '',
                    status: 'activo',
                });
            }
        }
    }, [open, businessToEdit, form]);

    const onSubmit = async (values: BusinessFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEditing && businessToEdit) {
                await updateBusiness(businessToEdit.id, values as Partial<Business>);
            } else {
                await createBusiness(values as Omit<Business, 'id'>);
            }
            onOpenChange(false);
        } catch (error: any) {
            // Error handling is managed by the store, but we can add specific handling here if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {isEditing ? `Editar Empresa: ${businessToEdit?.company_name}` : 'Nueva Empresa'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Nombre de la Empresa</Label>
                            <Input
                                id="company_name"
                                {...form.register('company_name')}
                                placeholder="Nombre S.A."
                            />
                            {form.formState.errors.company_name && (
                                <span className="text-xs text-destructive">
                                    {form.formState.errors.company_name.message}
                                </span>
                            )}
                        </div>
                    </div>

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
                                    form.setValue('status', val as BusinessFormValues['status'])
                                }
                                value={form.watch('status')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación (Coordenadas lat,lon)</Label>
                        <Input
                            id="location"
                            {...form.register('location')}
                            placeholder="-16.500, -68.150"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            {...form.register('description')}
                            placeholder="Breve descripción de la empresa..."
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
                            {isEditing ? 'Actualizar Empresa' : 'Registrar Empresa'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
