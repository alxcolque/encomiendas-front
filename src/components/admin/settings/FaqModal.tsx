import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order: number;
    active: boolean;
}

interface FaqModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (faq: FAQItem) => void;
    initialData?: FAQItem | null;
}

export function FaqModal({ open, onOpenChange, onSave, initialData }: FaqModalProps) {
    const [faq, setFaq] = useState<Partial<FAQItem>>({
        question: '',
        answer: '',
        active: true
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFaq(initialData);
            } else {
                setFaq({
                    question: '',
                    answer: '',
                    active: true
                });
            }
        }
    }, [open, initialData]);

    const handleSave = () => {
        if (!faq.question || !faq.answer) return;

        onSave({
            id: faq.id || Date.now().toString(), // Helper ID for new items
            question: faq.question,
            answer: faq.answer,
            active: faq.active ?? true,
            order: faq.order ?? 0
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Pregunta' : 'Nueva Pregunta'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Pregunta</Label>
                        <Input
                            id="question"
                            value={faq.question}
                            onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                            placeholder="¿Cuál es su horario de atención?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Respuesta</Label>
                        <Textarea
                            id="answer"
                            value={faq.answer}
                            onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
                            placeholder="Atendemos de lunes a viernes..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="active">Visible</Label>
                        <Switch
                            id="active"
                            checked={faq.active}
                            onCheckedChange={(checked) => setFaq({ ...faq, active: checked })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={!faq.question || !faq.answer}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
