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
import { MoreHorizontal, Search, Trash2, Edit, UserCheck, Phone, FileText } from 'lucide-react';
import { ClientModal } from './ClientModal';
import { useClientStore } from '@/stores/clientStore';
import { Client } from '@/interfaces/client.interface';

const STATUS_STYLES: Record<Client['status'], string> = {
    normal: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    blocked: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    deleted: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const STATUS_LABELS: Record<Client['status'], string> = {
    normal: 'Normal',
    blocked: 'Bloqueado',
    deleted: 'Eliminado',
};

export function ClientsTable() {
    const { clients, fetchClients, deleteClient, isLoading } = useClientStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const filtered = clients.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.ci_nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.phone ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (client: Client) => {
        setClientToEdit(client);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setClientToEdit(null);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteClient(deleteId);
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
                        placeholder="Buscar por nombre, CI/NIT o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50 border-border">
                            <TableHead>Cliente</TableHead>
                            <TableHead>CI / NIT</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Observaciones</TableHead>
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
                                    Cargando clientes...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No se encontraron clientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="hover:bg-muted/50 border-border"
                                >
                                    {/* Nombre */}
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-foreground">{client.name}</span>
                                        </div>
                                    </TableCell>

                                    {/* CI/NIT */}
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm font-mono">
                                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                            {client.ci_nit}
                                        </div>
                                    </TableCell>

                                    {/* Teléfono */}
                                    <TableCell>
                                        {client.phone ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                {client.phone}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">—</span>
                                        )}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={STATUS_STYLES[client.status]}
                                        >
                                            {STATUS_LABELS[client.status]}
                                        </Badge>
                                    </TableCell>

                                    {/* Observaciones */}
                                    <TableCell className="max-w-[200px]">
                                        <span className="text-sm text-muted-foreground line-clamp-1">
                                            {client.observations || '—'}
                                        </span>
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
                                                <DropdownMenuItem onClick={() => handleEdit(client)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => setDeleteId(client.id)}
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
            <ClientModal
                clientToEdit={clientToEdit}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            {/* Confirm Delete */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El cliente será eliminado
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
