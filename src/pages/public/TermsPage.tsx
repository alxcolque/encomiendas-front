export default function TermsPage() {
    return (
        <div className="container py-12 max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-display">Términos y Condiciones</h1>
            <p className="text-muted-foreground">Última actualización: 14 de Febrero, 2026</p>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Aceptación de los Términos</h2>
                <p className="text-muted-foreground">
                    Al acceder y utilizar los servicios de KOLMOX, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Descripción del Servicio</h2>
                <p className="text-muted-foreground">
                    KOLMOX proporciona servicios de logística, transporte de carga y paquetería a nivel nacional. Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Responsabilidades del Usuario</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Proporcionar información precisa y completa sobre los envíos.</li>
                    <li>Embalar adecuadamente los artículos para su transporte seguro.</li>
                    <li>No enviar artículos prohibidos o ilegales según la legislación boliviana.</li>
                    <li>Pagar las tarifas correspondientes por los servicios solicitados.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Limitación de Responsabilidad</h2>
                <p className="text-muted-foreground">
                    KOLMOX no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso de nuestros servicios, salvo en casos de negligencia grave o dolo comprobado.
                </p>
            </section>
        </div>
    );
}
