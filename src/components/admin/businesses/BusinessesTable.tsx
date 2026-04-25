import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Trash2, Edit, Building2, Phone, MapPin, FileText } from 'lucide-react';
import { BusinessModal } from './BusinessModal';
import { useBusinessStore } from '@/stores/businessStore';
import { Business } from '@/interfaces/business.interface';

const STATUS_STYLES: Record<string, string> = {
    activo: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    inactivo: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    bloqueado: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    bloqueado: 'Bloqueado',
};

export function BusinessesTable() {
    const { businesses, fetchBusinesses, deleteBusiness, isLoading } = useBusinessStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [businessToEdit, setBusinessToEdit] = useState<Business | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const filtered = businesses.filter(
        (b) =>
            b.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.phone ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (business: Business) => {
        setBusinessToEdit(business);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setBusinessToEdit(null);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteBusiness(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, código o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                    <Building2 className="mr-2 h-4 w-4" />
                    Nueva Empresa
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50 border-border">
                            <TableHead>Empresa</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    <div className={`loading-logo ${"mx-auto"}`}></div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No se encontraron empresas
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((business) => (
                                <TableRow
                                    key={business.id}
                                    className="hover:bg-muted/50 border-border"
                                >
                                    {/* Nombre */}
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                {business.company_name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-foreground">{business.company_name}</span>
                                        </div>
                                    </TableCell>

                                    {/* Código */}
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                                            <FileText className="h-3.5 w-3.5" />
                                            {business.code}
                                        </div>
                                    </TableCell>

                                    {/* Teléfono */}
                                    <TableCell>
                                        {business.phone ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                {business.phone}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        )}
                                    </TableCell>

                                    {/* Ubicación */}
                                    <TableCell>
                                        {business.location ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                {business.location}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        )}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={STATUS_STYLES[business.status]}
                                        >
                                            {STATUS_LABELS[business.status]}
                                        </Badge>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menú</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(business)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => setDeleteId(business.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            <BusinessModal
                businessToEdit={businessToEdit}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            {/* Confirm Delete */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La empresa será eliminada
                            permanentemente del sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
