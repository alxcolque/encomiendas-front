import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { AdminUser } from "@/interfaces/user.interface";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserModal } from "./UserModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function UsersTable() {
    const { users, isLoading, getUsers, deleteUser } = useUserStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        getUsers();
    }, []);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteUser(deleteId);
            setDeleteId(null);
        }
    };

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge variant="destructive" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">Admin</Badge>;
            case 'worker': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Operador</Badge>;
            case 'driver': return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">Conductor</Badge>;
            case 'company': return <Badge variant="default" className="bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20">Empresa</Badge>;
            case 'partner': return <Badge variant="destructive" className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border-pink-500/20">Socio</Badge>;
            default: return <Badge variant="outline">Cliente</Badge>;
        }
    };

    if (isLoading && users.length === 0) {
        return <div className="loading-logo-section"></div>;
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Table Container */}
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    <div className={`loading-logo ${"mx-auto"}`}></div>
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No se encontraron usuarios
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors border-border">
                                    <TableCell>
                                        <Avatar className="h-9 w-9 border border-border">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20' : ''}>
                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
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
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                                    Copiar ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(user.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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

            <UserModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                userToEdit={selectedUser}
            />

            {/* Confirm Delete */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El usuario será eliminado
                            permanentemente del sistema y perderá acceso.
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
