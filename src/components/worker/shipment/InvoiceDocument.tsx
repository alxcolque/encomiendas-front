import React from 'react';
import { Invoice } from '@/interfaces/invoice.interface';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

interface InvoiceDocumentProps {
    invoice: Invoice;
    onClose?: () => void;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white text-black p-2 max-w-4xl mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0">
            {/* Header controls - hidden when printing */}
            <div className="flex justify-between mb-8 print:hidden">
                <Button variant="outline" onClick={onClose} className="gap-2">
                    <X className="w-4 h-4" /> Cerrar
                </Button>
                <Button onClick={handlePrint} className="gap-2 bg-primary text-white">
                    <Printer className="w-4 h-4" /> Imprimir
                </Button>
            </div>

            {/* Invoice Content */}
            <div className="flex justify-between items-start mb-10">
                <div className="text-sm font-bold uppercase">
                    <p className="text-xl">{import.meta.env.VITE_COMPANY_NAME || 'KOLMOX'}</p>
                    <p>CASA MATRIZ</p>
                    <p>Calle Juan Pablo II #54</p>
                    <p>Teléfono: 2457896</p>
                    <p>La Paz</p>
                </div>
                <div className="text-sm border-2 border-black p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-x-4">
                        <p className="font-bold">NIT</p>
                        <p>{import.meta.env.VITE_COMPANY_NIT || '12345678'}</p>
                        <p className="font-bold">FACTURA Nº</p>
                        <p>{invoice.invoice_number}</p>
                        <p className="font-bold">CUF</p>
                        <p className="break-all text-[10px] w-48">{invoice.cuf || 'N/A'}</p>
                        <p className="font-bold mt-2">ACTIVIDAD</p>
                        <p className="text-[10px] mt-2 italic">venta por mayor de diversos productos sin especialización venta</p>
                    </div>
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-black mb-1">FACTURA</h1>
                <p className="text-sm">(Con Derecho a Crédito Fiscal)</p>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 mb-8 text-sm border-t border-b border-black py-4">
                <p className="font-bold">Fecha:</p>
                <p>{invoice.emit_date ? format(new Date(invoice.emit_date), "dd/MM/yyyy HH:mm aa", { locale: es }) : 'N/A'}</p>
                <p className="font-bold">Nombre/Razon Social:</p>
                <p>{invoice.receipt_name}</p>
                <div className="col-start-1 font-bold">NIT/CI/CEX:</div>
                <div>{invoice.doc_num}{invoice.complement ? `-${invoice.complement}` : ''}</div>
            </div>

            <table className="w-full border-collapse border border-black mb-6 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-center uppercase text-[10px] w-24">Código Producto / Servicio</th>
                        <th className="border border-black p-2 text-center uppercase text-[10px] w-20">Cantidad</th>
                        <th className="border border-black p-2 text-center uppercase text-[10px]">Descripción</th>
                        <th className="border border-black p-2 text-center uppercase text-[10px] w-28">Precio Unitario</th>
                        <th className="border border-black p-2 text-center uppercase text-[10px] w-24">Descuento</th>
                        <th className="border border-black p-2 text-center uppercase text-[10px] w-28">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.details.map((detail, index) => (
                        <tr key={index}>
                            <td className="border border-black p-2 text-center text-[11px]">JN-131231</td>
                            <td className="border border-black p-2 text-center">{detail.qty}</td>
                            <td className="border border-black p-2 uppercase text-[11px]">{detail.description}</td>
                            <td className="border border-black p-2 text-right">{Number(detail.unit_price).toFixed(2)}</td>
                            <td className="border border-black p-2 text-right">{Number(detail.discount).toFixed(2)}</td>
                            <td className="border border-black p-2 text-right font-bold">{Number(detail.sub_total).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5} className="text-right font-bold p-2 uppercase text-[10px]">Total BS</td>
                        <td className="border border-black p-2 text-right font-bold">{Number(invoice.total).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="text-right font-bold p-2 uppercase text-[10px]">Importe Base Crédito Fiscal</td>
                        <td className="border border-black p-2 text-right font-bold">{Number(invoice.total_iva).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="flex justify-between items-end">
                <div className="text-sm italic">
                    <p className="font-bold mb-4">Son: {invoice.total} 00/100 Bolivianos</p>
                    <p className="max-w-[400px] mb-2 text-[10px] uppercase font-bold">"ESTA FACTURA CONTRIBUYE AL DESARROLLO DE NUESTRO PAIS, EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO A LEY"</p>
                    <p className="text-[10px]">Ley N° 453: Tienes derecho a recibir información sobre las características y contenidos de los servicios que utilices.</p>
                </div>
                <div className="w-24 h-24 border border-black flex items-center justify-center p-1 bg-white">
                    {/* Placeholder for QR Code */}
                    <div className="w-full h-full bg-black/10 flex items-center justify-center text-[8px] text-center">
                        QR CODE<br />PLACEHOLDER
                    </div>
                </div>
            </div>
        </div>
    );
};
