import { useEffect } from "react";
import { useOfficeStore } from "@/stores/officeStore";
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
import { Edit2, Trash2, MoreHorizontal, MapPin, Phone } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Office } from "@/interfaces/office.interface";

interface OfficesTableProps {
    onEdit: (office: Office) => void;
}

export function OfficesTable({ onEdit }: OfficesTableProps) {
    const { offices, isLoading, fetchOffices, deleteOffice } = useOfficeStore();

    useEffect(() => {
        fetchOffices();
    }, []);

    if (isLoading && offices.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Cargando oficinas...</div>;
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Oficina</TableHead>
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Encargado</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {offices.map((office) => (
                        <TableRow key={office.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    {office.name}
                                </div>
                            </TableCell>
                            <TableCell>{office.city}</TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={office.address}>
                                {office.address}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 text-xs">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {office.phone}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{office.manager}</TableCell>
                            <TableCell>
                                <Badge variant={office.status === 'active' ? 'default' : 'secondary'} className={office.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20' : ''}>
                                    {office.status === 'active' ? 'Activa' : 'Inactiva'}
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
                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(office.address)}>
                                            Copiar Dirección
                                        </DropdownMenuItem>
                                        {office.coordinates && (
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(office.coordinates!)}>
                                                Copiar Coordenadas
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onEdit(office)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteOffice(office.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
