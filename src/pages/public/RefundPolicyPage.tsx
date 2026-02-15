export default function RefundPolicyPage() {
    return (
        <div className="container py-12 max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-display">Política de Reembolsos</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Garantía de Servicio</h2>
                <p className="text-muted-foreground">
                    En KOLMOX nos esforzamos por brindar un servicio de excelencia. Si no está satisfecho con nuestro servicio, por favor contáctenos para resolver su situación.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Elegibilidad para Reembolsos</h2>
                <p className="text-muted-foreground">
                    Se considerarán reembolsos en los siguientes casos:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Pérdida total del paquete confirmada por nuestro sistema.</li>
                    <li>Daños severos al contenido causados por manipulación inadecuada (sujeto a inspección y tipo de embalaje).</li>
                    <li>Retrasos injustificados superiores a 72 horas en servicios Express (reembolso del excedente de tarifa express).</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Proceso de Solicitud</h2>
                <p className="text-muted-foreground">
                    Para solicitar un reembolso, debe presentar un reclamo a través de nuestra página de "Libro de Reclamaciones" o contactar a servicio al cliente dentro de los 5 días hábiles posteriores a la fecha de entrega estimada.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Excepciones</h2>
                <p className="text-muted-foreground">
                    No se otorgarán reembolsos por retrasos causados por fuerza mayor (clima, bloqueos, etc.), direcciones incorrectas proporcionadas por el remitente, o embalaje inadecuado.
                </p>
            </section>
        </div>
    );
}
