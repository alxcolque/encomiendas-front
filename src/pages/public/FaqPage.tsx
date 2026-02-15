import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "¿Cómo puedo rastrear mi envío?",
        answer: "Puedes rastrear tu envío ingresando el código de seguimiento (ej. ENV-2025-001) en la barra de búsqueda de la página de inicio o en la sección de 'Seguimiento' en el menú principal."
    },
    {
        question: "¿Cuáles son los tiempos de entrega?",
        answer: "Los tiempos de entrega varían según el destino y el tipo de servicio. Para envíos nacionales estándar, el tiempo estimado es de 24 a 48 horas. Para envíos express, garantizamos la entrega en menos de 24 horas en ciudades capitales."
    },
    {
        question: "¿Qué objetos están prohibidos?",
        answer: "No transportamos materiales peligrosos, explosivos, armas, drogas, ni productos perecederos sin el embalaje adecuado. Consulta nuestros términos y condiciones para ver la lista completa."
    },
    {
        question: "¿Tienen seguro de carga?",
        answer: "Sí, todos nuestros envíos cuentan con un seguro básico. Para mercancías de alto valor, ofrecemos seguros adicionales con cobertura extendida."
    },
    {
        question: "¿Cómo puedo solicitar una cotización corporativa?",
        answer: "Para cotizaciones corporativas, puedes contactar a nuestro equipo de ventas a través del formulario de contacto o enviando un correo a ventas@kolmox.com."
    }
];

export default function FaqPage() {
    return (
        <div className="container py-12 max-w-3xl">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-display font-bold">Preguntas Frecuentes</h1>
                <p className="text-muted-foreground text-lg">
                    Resolvemos tus dudas sobre nuestros servicios de envíos y logística.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-4 bg-card/50">
                        <AccordionTrigger className="text-lg font-medium py-6 hover:text-primary transition-colors text-left">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
