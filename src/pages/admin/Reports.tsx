import { useEffect, useState } from "react";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { ReportsStats } from "@/components/admin/reports/ReportsStats";
import { RevenueChart } from "@/components/admin/reports/RevenueChart";
import { ShipmentVolumeChart } from "@/components/admin/reports/ShipmentVolumeChart";
import { OrderStatusChart } from "@/components/admin/reports/OrderStatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useReportStore } from "@/stores/reportStore";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, endOfMonth, endOfYear, endOfWeek } from "date-fns";
import { useRegisterRefresh } from "@/stores/refreshStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type DateFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

export default function Reports() {
    const { data, isLoading, fetchReportData } = useReportStore();
    const { general, fetchSettings: fetchGeneralSettings } = useSettingsStore();
    const [filter, setFilter] = useState<DateFilter>('month');

    // Default dates
    const [startDate, setStartDate] = useState<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    useEffect(() => {
        fetchGeneralSettings();
    }, [fetchGeneralSettings]);

    // Helper to load image to base64 for PDF
    const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // PDF Download Handler
    const handleDownloadPDF = async () => {
        if (!data || !data.invoices) return;

        const doc = new jsPDF('p', 'mm', 'a4');
        const siteName = general.siteName || "KOLMOX";
        
        let logoBase64 = "";
        const logoUrl = general.logo || "/logo.png";
        
        try {
            if (logoUrl) {
                const absoluteLogoUrl = logoUrl.startsWith('http') 
                    ? logoUrl 
                    : window.location.origin + logoUrl;
                
                logoBase64 = await getBase64ImageFromUrl(absoluteLogoUrl);
            }
        } catch (e) {
            console.error("Failed to load logo for PDF", e);
        }

        // Draw header background/gradient accent (Orange brand color: HSL 32 100% 50% => rgb(255, 138, 0))
        doc.setFillColor(255, 138, 0);
        doc.rect(0, 0, 210, 8, 'F');

        // Draw Logo or Site Name
        let headerOffset = 18;
        if (logoBase64) {
            try {
                doc.addImage(logoBase64, 'PNG', 14, headerOffset, 15, 15);
                headerOffset += 4;
            } catch (imgErr) {
                console.error("Add image failed", imgErr);
            }
        }

        // Company Details Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(33, 43, 54);
        doc.text(siteName, logoBase64 ? 33 : 14, headerOffset + 4);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(112, 112, 112);
        
        // Right side header details
        doc.text(`Fecha Emisión: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 196, 20, { align: "right" });
        doc.text(`Periodo: ${startDate} al ${endDate}`, 196, 24, { align: "right" });
        if (general.address) {
            doc.text(`Dirección: ${general.address}`, 196, 28, { align: "right" });
        }
        if (general.supportPhone || general.supportEmail) {
            doc.text(`Contacto: ${general.supportPhone || ''} ${general.supportEmail ? ' | ' + general.supportEmail : ''}`, 196, 32, { align: "right" });
        }

        // Draw horizontal divider line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(14, 38, 196, 38);

        // Document Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 138, 0);
        doc.text("REPORTE DE FACTURACIÓN Y PAGO", 14, 46);

        // Subtitle/Brief
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(99, 115, 129);
        doc.text(`Se encontraron ${data.invoices.length} facturas/recibos en este periodo.`, 14, 51);

        // Generate data rows for table
        const tableBody = data.invoices.map((inv) => {
            const dateStr = inv.emit_date 
                ? format(new Date(inv.emit_date), "dd/MM/yyyy HH:mm") 
                : format(new Date(inv.created_at), "dd/MM/yyyy HH:mm");
            
            const paymentMethodStr = inv.payment_method === 1 
                ? "Efectivo" 
                : inv.payment_method === 2 
                    ? "QR" 
                    : "Otro";
                    
            const amountFormatted = `${Number(inv.total).toFixed(2)} Bs.`;
            
            return [
                inv.invoice_number || "S/N",
                inv.shipment?.tracking_code || "—",
                inv.receipt_name || "—",
                dateStr,
                paymentMethodStr,
                amountFormatted
            ];
        });

        // Compute total amount sum
        const totalSum = data.invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
        const totalSumFormatted = `${totalSum.toFixed(2)} Bs.`;

        // Render Table using autoTable
        autoTable(doc, {
            startY: 56,
            margin: { left: 14, right: 14 },
            head: [['Nro. Factura', 'Encomienda', 'Cliente / Receptor', 'Fecha de Emisión', 'Método Pago', 'Monto (Bs.)']],
            body: tableBody,
            foot: [
                [
                    { content: 'TOTAL GENERAL', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
                    { content: totalSumFormatted, styles: { fontStyle: 'bold', textColor: [255, 138, 0] } }
                ]
            ],
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 3,
                textColor: [33, 43, 54],
            },
            headStyles: {
                fillColor: [255, 138, 0], // orange brand color
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'left',
            },
            alternateRowStyles: {
                fillColor: [248, 249, 250],
            },
            columnStyles: {
                5: { halign: 'left' }
            },
            theme: 'striped',
        });

        doc.save(`Reporte_Facturas_${startDate}_al_${endDate}.pdf`);
    };

    // Register refresh
    useRegisterRefresh(async () => {
        await fetchReportData(startDate, endDate);
    });

    useEffect(() => {
        const today = new Date();
        let newStart = startDate;
        let newEnd = endDate;

        switch (filter) {
            case 'today':
                newStart = format(today, 'yyyy-MM-dd');
                newEnd = format(today, 'yyyy-MM-dd');
                break;
            case 'week':
                newStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                newEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                break;
            case 'month':
                newStart = format(startOfMonth(today), 'yyyy-MM-dd');
                newEnd = format(endOfMonth(today), 'yyyy-MM-dd');
                break;
            case 'year':
                newStart = format(startOfYear(today), 'yyyy-MM-dd');
                newEnd = format(endOfYear(today), 'yyyy-MM-dd');
                break;
            case 'custom':
                return; // Do not auto-fetch on custom selection until dates are manually changed
        }

        setStartDate(newStart);
        setEndDate(newEnd);
        fetchReportData(newStart, newEnd);
    }, [filter]);

    // Handle custom date applies
    useEffect(() => {
        if (filter === 'custom' && startDate && endDate) {
            fetchReportData(startDate, endDate);
        }
    }, [startDate, endDate, filter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <AdminSectionHeader
                    title="Reportes y Estadísticas"
                    subtitle="Análisis detallado del rendimiento de la empresa"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select value={filter} onValueChange={(v: DateFilter) => setFilter(v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoy</SelectItem>
                            <SelectItem value="week">Esta Semana</SelectItem>
                            <SelectItem value="month">Este Mes</SelectItem>
                            <SelectItem value="year">Este Año</SelectItem>
                            <SelectItem value="custom">Rango Personalizado</SelectItem>
                        </SelectContent>
                    </Select>

                    {filter === 'custom' && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-[150px]"
                            />
                            <span>-</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-[150px]"
                            />
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <div className={`loading-logo ${"w-12 h-12 animate-pulse text-primary"}`}></div>
                </div>
            ) : !data ? (
                <div className="text-center text-muted-foreground p-12">No hay datos disponibles</div>
            ) : (
                <>
                    <ReportsStats kpi={data.kpi} />

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                        <RevenueChart chartData={data.charts.revenue} />
                        <ShipmentVolumeChart chartData={data.charts.volume} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <OrderStatusChart chartData={data.charts.status} />
                        <Card className="md:col-span-2 border-border/50 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Rendimiento por Agencia</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* This is just visual placeholder for office since we did not add office aggregation yet, but it can be fully functional later */}
                                {[
                                    { name: 'Agencia Central Oruro', value: 85, color: 'gradient-primary' },
                                    { name: 'Agencia Santa Cruz', value: 65, color: 'bg-blue-500' },
                                    { name: 'Agencia La Paz', value: 45, color: 'bg-orange-500' },
                                    { name: 'Agencia Cochabamba', value: 30, color: 'bg-green-500' },
                                ].map((office) => (
                                    <div key={office.name} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-foreground">{office.name}</span>
                                            <span className="text-primary">{office.value}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full ${office.color} shadow-lg transition-all duration-500`} style={{ width: `${office.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla Dinámica de Facturas */}
                    <Card className="border-border/50 shadow-md">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold">Detalle de Facturación</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Listado de todas las facturas y comprobantes del periodo seleccionado
                                </p>
                            </div>
                            <Button
                                onClick={handleDownloadPDF}
                                className="gradient-primary text-white font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all rounded-xl h-11 px-5"
                                disabled={!data.invoices || data.invoices.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Descargar PDF
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {!data.invoices || data.invoices.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron facturas en este periodo
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                    <TableHead className="font-bold">Nro. Factura</TableHead>
                                                    <TableHead className="font-bold">Encomienda</TableHead>
                                                    <TableHead className="font-bold">Cliente / Receptor</TableHead>
                                                    <TableHead className="font-bold">Fecha de Emisión</TableHead>
                                                    <TableHead className="font-bold">Método Pago</TableHead>
                                                    <TableHead className="text-right font-bold">Monto (Bs.)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.invoices.map((invoice) => {
                                                    const formattedDate = invoice.emit_date
                                                        ? format(new Date(invoice.emit_date), "dd/MM/yyyy HH:mm")
                                                        : format(new Date(invoice.created_at), "dd/MM/yyyy HH:mm");
                                                    return (
                                                        <TableRow key={invoice.id} className="hover:bg-muted/50 transition-colors">
                                                            <TableCell className="font-medium text-primary">
                                                                {invoice.invoice_number || "S/N"}
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs">
                                                                {invoice.shipment?.tracking_code || "—"}
                                                            </TableCell>
                                                            <TableCell className="max-w-[200px] truncate" title={invoice.receipt_name}>
                                                                {invoice.receipt_name || "—"}
                                                            </TableCell>
                                                            <TableCell>{formattedDate}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={invoice.payment_method === 1 ? "default" : "secondary"}
                                                                    className={
                                                                        invoice.payment_method === 1
                                                                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 font-semibold"
                                                                            : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 font-semibold"
                                                                    }
                                                                >
                                                                    {invoice.payment_method === 1 ? "Efectivo" : "Pago por QR"}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right font-semibold">
                                                                {Number(invoice.total).toFixed(2)} Bs.
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {/* Fila del Total */}
                                                <TableRow className="bg-muted/30 font-bold border-t-2 border-border/80">
                                                    <TableCell colSpan={5} className="text-right text-foreground">
                                                        TOTAL FACTURADO
                                                    </TableCell>
                                                    <TableCell className="text-right text-primary text-base font-extrabold">
                                                        {data.invoices
                                                            .reduce((sum, inv) => sum + Number(inv.total), 0)
                                                            .toFixed(2)}{" "}
                                                        Bs.
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
