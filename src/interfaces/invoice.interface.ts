export interface InvoiceDetail {
    description: string;
    qty: number;
    unit: number;
    unit_price: number;
    discount: number;
    sub_total: number;
}

export interface Invoice {
    id: number;
    type: string;
    shipment_id: number;
    business_name: string;
    nit_ci_emisor: string;
    invoice_number: string;
    receipt_name: string;
    doc_num: string;
    complement?: string;
    cuf?: string;
    cufd?: string;
    cod_suc?: number;
    cod_sale?: number;
    emit_date: string;
    details: InvoiceDetail[];
    payment_method: number;
    total: number;
    total_iva: number;
    currency: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}
