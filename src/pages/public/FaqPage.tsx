import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSettingsStore } from "@/stores/settingsStore";

export default function FaqPage() {
    const { faqs } = useSettingsStore();

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
                    <AccordionItem key={faq.id} value={`item-${index}`} className="border rounded-xl px-4 bg-card/50">
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
