import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSettingsTab() {
    const { faqs, updateFaqs, isLoading } = useSettingsStore();
    const [localFaqs, setLocalFaqs] = useState(faqs);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newFaqs = [...localFaqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setLocalFaqs(newFaqs);
    };

    const handleAdd = () => {
        setLocalFaqs([...localFaqs, { id: Date.now().toString(), question: 'Nueva Pregunta', answer: '' }]);
    };

    const handleDelete = (index: number) => {
        const newFaqs = localFaqs.filter((_, i) => i !== index);
        setLocalFaqs(newFaqs);
    };

    const handleSave = () => {
        updateFaqs(localFaqs).then(() => toast.success("FAQs actualizadas"));
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex justify-end">
                <Button onClick={handleAdd} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Pregunta
                </Button>
            </div>

            <div className="space-y-4">
                {localFaqs.map((faq, index) => (
                    <div key={faq.id} className="p-4 border rounded-lg bg-card space-y-3 relative group">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete(index)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        <Input
                            value={faq.question}
                            onChange={(e) => handleUpdate(index, 'question', e.target.value)}
                            placeholder="Pregunta"
                            className="font-medium"
                        />
                        <Textarea
                            value={faq.answer}
                            onChange={(e) => handleUpdate(index, 'answer', e.target.value)}
                            placeholder="Respuesta"
                            className="min-h-[80px]"
                        />
                    </div>
                ))}
            </div>

            <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Guardar FAQs
            </Button>
        </div>
    );
}
