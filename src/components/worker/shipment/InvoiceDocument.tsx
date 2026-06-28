import React, { useEffect } from 'react';
import { Invoice } from '@/interfaces/invoice.interface';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface InvoiceDocumentProps {
    invoice: Invoice;
    onClose?: () => void;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice, onClose }) => {
    const { user } = useAuthStore();

    const handlePrint = () => {
        window.print();
    };

    // Cast shipment properties if available from API response
    const shipment = (invoice as any).shipment;
    const trackingCode = shipment?.tracking_code || invoice.invoice_number || 'KOLMOX';

    // Generate QR code URL
    const trackingUrl = `${window.location.protocol}//${window.location.host}/tracking?code=${trackingCode}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`;

    // Operator and box details
    const operatorName = user?.name || "Cajero";
    const boxNumber = "Caja 01";

    // Text to Spanish words conversion helper for amount literal
    const numeroALetras = (num: number): string => {
        const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
        const decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
        const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
        const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

        if (num === 0) return "CERO";
        if (num === 100) return "CIEN";

        let letras = "";

        if (num >= 1000) {
            const miles = Math.floor(num / 1000);
            if (miles === 1) {
                letras += "MIL ";
            } else {
                letras += numeroALetras(miles) + " MIL ";
            }
            num %= 1000;
        }

        if (num >= 100) {
            const cts = Math.floor(num / 100);
            if (cts === 1 && num % 100 === 0) {
                letras += "CIEN ";
            } else {
                letras += centenas[cts] + " ";
            }
            num %= 100;
        }

        if (num >= 20) {
            const dec = Math.floor(num / 10);
            const uni = num % 10;
            if (dec === 2 && uni > 0) {
                letras += "VEINTI" + unidades[uni] + " ";
            } else {
                letras += decenas[dec];
                if (uni > 0) {
                    letras += " Y " + unidades[uni];
                }
                letras += " ";
            }
        } else if (num >= 10) {
            letras += especiales[num - 10] + " ";
        } else if (num > 0) {
            letras += unidades[num] + " ";
        }

        return letras.trim();
    };

    const formatLiteral = (total: number): string => {
        const integerPart = Math.floor(total);
        const cents = Math.round((total - integerPart) * 100);
        const centsStr = cents.toString().padStart(2, '0') + "/100 BOLIVIANOS";
        const words = numeroALetras(integerPart);
        return `SON: ${words} ${centsStr}`;
    };

    // Programmatic vector barcode elements mapping
    let currentX = 6;
    const barcodeWidths = [1, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2];
    const barcodeElements = barcodeWidths.map((width, idx) => {
        const isBar = idx % 2 === 0;
        const x = currentX;
        currentX += width;
        if (isBar) {
            return <rect key={idx} x={x} width={width} height={10} fill="black" stroke="none" />;
        }
        return null;
    });

    // Formatting totals and discounts
    const subtotal = invoice.details.reduce((sum, d) => sum + Number(d.unit_price) * Number(d.qty), 0);
    const totalDiscount = invoice.details.reduce((sum, d) => sum + Number(d.discount), 0);

    return (
        <div className="bg-slate-100 min-h-screen py-8 px-4 flex flex-col items-center justify-start print:bg-white print:p-0 print:py-0 print:min-h-0 select-none">
            {/* Header controls - hidden when printing */}
            <div className="w-full max-w-[80mm] flex justify-between mb-4 print:hidden gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1 gap-2 rounded-xl h-10 border-gray-300 bg-white hover:bg-slate-50 transition-colors">
                    <X className="w-4 h-4" /> Cerrar
                </Button>
                <Button onClick={handlePrint} className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl h-10 shadow-md shadow-primary/20 transition-all hover:scale-[1.02]">
                    <Printer className="w-4 h-4" /> Imprimir
                </Button>
            </div>

            {/* Thermal Ticket Container */}
            <div className="w-full max-w-[80mm] bg-white text-black p-4 font-mono text-xs shadow-md border border-gray-200 print:shadow-none print:border-none print:p-2 ticket-container select-text leading-tight tracking-wide">

                {/* 1. Logo / Name & Matriz Info */}
                <div className="text-center mb-2">
                    <h2 className="text-lg font-black tracking-widest">{import.meta.env.VITE_COMPANY_NAME || 'KOLMOX'}</h2>
                    <p className="text-[10px] font-semibold uppercase">Transporte y Encomiendas</p>
                    <p className="text-[9px] mt-1 font-medium">CASA MATRIZ</p>
                    <p className="text-[9px]">Calle Juan Pablo II #54</p>
                    <p className="text-[9px]">Teléfono: 2457896</p>
                    <p className="text-[9px]">La Paz - Bolivia</p>
                    <p className="text-[9px]">NIT: {import.meta.env.VITE_COMPANY_NIT || '12345678'}</p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 2. Título */}
                <div className="text-center my-1">
                    <h1 className="text-sm font-black tracking-widest">FACTURA</h1>
                    <p className="text-[9px] font-bold uppercase">(Con Derecho a Crédito Fiscal)</p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 3. Información Fiscal */}
                <div className="space-y-0.5 text-[10px]">
                    <p><span className="font-bold">Factura Nº:</span> {invoice.invoice_number}</p>
                    <p className="break-all"><span className="font-bold">CUF:</span> {invoice.cuf || 'N/A'}</p>
                    <p className="text-[9px] leading-tight"><span className="font-bold">Actividad:</span> venta por mayor de diversos productos sin especialización venta</p>
                    <p><span className="font-bold">Fecha/Hora:</span> {invoice.emit_date ? format(new Date(invoice.emit_date), "dd/MM/yyyy HH:mm aa", { locale: es }) : 'N/A'}</p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 4. Datos del Cliente */}
                <div className="space-y-0.5 text-[10px]">
                    <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5">Cliente:</p>
                    <p><span className="font-bold">Nombre:</span> {invoice.receipt_name}</p>
                    <p><span className="font-bold">NIT/CI:</span> {invoice.doc_num}{invoice.complement ? `-${invoice.complement}` : ''}</p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 5. Información del Envío */}
                <div className="space-y-0.5 text-[10px]">
                    <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5">Datos del Envío:</p>
                    <p><span className="font-bold">Nro. Guía:</span> {trackingCode}</p>
                    <p><span className="font-bold">Origen:</span> {shipment?.origin_office?.city?.name || shipment?.origin_office?.name || 'LA PAZ'}</p>
                    <p><span className="font-bold">Destino:</span> {shipment?.destination_office?.city?.name || shipment?.destination_office?.name || 'ORURO'}</p>
                    <p><span className="font-bold">Servicio:</span> {shipment?.type_service?.toUpperCase() || 'STANDARD'}</p>
                    <p><span className="font-bold">Paquetes:</span> {shipment?.is_pack ? '1 (Paquete)' : '1 (Sobre)'}</p>
                    <p><span className="font-bold">Peso:</span> {shipment?.weight ? `${shipment.weight} Kg` : '—'}</p>
                    <p><span className="font-bold">Operador:</span> {operatorName}</p>
                    <p><span className="font-bold">Caja:</span> {boxNumber}</p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 6. Detalle */}
                <div className="text-[10px] space-y-2">
                    <p className="font-bold uppercase tracking-wider text-[11px] mb-1">Detalle:</p>
                    {invoice.details.map((detail, index) => (
                        <div key={index}>
                            <p className="font-semibold text-left">{detail.qty} x {detail.description.toUpperCase()}</p>
                            <p className="text-right font-bold">Bs {Number(detail.sub_total).toFixed(2)}</p>
                            {index < invoice.details.length - 1 && (
                                <p className="text-center font-bold my-1 text-black opacity-30">-----------------------</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 7. Totales */}
                <div className="space-y-1 text-[11px] font-semibold">
                    <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>Bs {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>DESCUENTO:</span>
                        <span>Bs {totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black border-t border-black pt-1">
                        <span>TOTAL A PAGAR:</span>
                        <span>Bs {Number(invoice.total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 text-black opacity-70">
                        <span>BASE CRÉD. FISCAL:</span>
                        <span>Bs {Number(invoice.total_iva).toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 8. Monto Literal */}
                <div className="text-center text-[10px] uppercase font-bold px-1 my-1 leading-tight">
                    {formatLiteral(Number(invoice.total))}
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 9. Código QR */}
                <div className="flex flex-col items-center justify-center my-3 bg-white p-1">
                    <img src={qrCodeUrl} alt="Factura QR" className="w-36 h-36 object-contain" />
                    <p className="text-[8px] mt-1 text-center font-bold uppercase opacity-60">Escanee para verificar factura</p>
                </div>

                {/* 10. Código de Barras */}
                <div className="flex flex-col items-center justify-center my-2 bg-white pb-1">
                    <svg className="w-48 h-10 mt-1" viewBox="0 0 60 16">
                        {barcodeElements}
                        <text x="30" y="15" fontSize="3" textAnchor="middle" fontFamily="monospace" fill="black" fontWeight="bold">
                            {trackingCode}
                        </text>
                    </svg>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider my-1 text-black opacity-80">
                    --------------------------------
                </div>

                {/* 11. Pie Legal SIN y Agradecimiento */}
                <div className="text-center text-[8px] uppercase font-semibold space-y-2 mt-1 leading-normal">
                    <p className="px-1">
                        "ESTA FACTURA CONTRIBUYE AL DESARROLLO DE NUESTRO PAIS, EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO A LEY"
                    </p>
                    <p className="italic opacity-85 px-1">
                        Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.
                    </p>
                    <p className="text-[9px] font-black tracking-widest mt-3">
                        ¡GRACIAS POR SU PREFERENCIA!
                    </p>
                    <p className="text-[9px] font-bold mt-1 lowercase opacity-75">
                        www.kolmox.com
                    </p>
                </div>

                <div className="text-center font-bold text-[10px] ticket-divider mt-2 mb-1 text-black opacity-80">
                    ================================
                </div>

            </div>

            {/* Print and custom alignment styles override */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: 80mm auto;
                        margin: 0; 
                    }
                    html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        width: 80mm !important;
                        background: white !important; 
                        color: black !important;
                        -webkit-print-color-adjust: exact !important; 
                        color-adjust: exact !important;
                    }
                    /* Force black text for thermal printing */
                    * {
                        color: #000 !important;
                    }
                    .print\\:hidden { 
                        display: none !important; 
                    }
                    .ticket-container {
                        width: 80mm !important;
                        max-width: 80mm !important;
                        padding: 1mm !important;
                        margin: 0 auto !important;
                        background: white !important;
                        font-family: monospace !important;
                        border: none !important;
                        box-shadow: none !important;
                        font-size: 10px !important;
                    }
                    .ticket-divider {
                        letter-spacing: -1.5px !important;
                    }
                }
            `}} />
        </div>
    );
};
