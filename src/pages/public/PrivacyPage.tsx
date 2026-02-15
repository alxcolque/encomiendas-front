export default function PrivacyPage() {
    return (
        <div className="container py-12 max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold font-display">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: 14 de Febrero, 2026</p>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Recopilación de Información</h2>
                <p className="text-muted-foreground">
                    Recopilamos información personal que usted nos proporciona voluntariamente, como nombre, dirección, correo electrónico y número de teléfono, necesaria para procesar y entregar sus envíos.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Uso de la Información</h2>
                <p className="text-muted-foreground">
                    Utilizamos su información para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Procesar y entregar sus pedidos.</li>
                    <li>Comunicarnos con usted sobre el estado de sus envíos.</li>
                    <li>Mejorar nuestros servicios y atención al cliente.</li>
                    <li>Cumplir con obligaciones legales.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Compartir Información</h2>
                <p className="text-muted-foreground">
                    No vendemos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio (por ejemplo, conductores asociados), bajo estrictos acuerdos de confidencialidad.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Seguridad de Datos</h2>
                <p className="text-muted-foreground">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
            </section>
        </div>
    );
}
