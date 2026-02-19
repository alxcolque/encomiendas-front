import { Button } from "@/components/ui/button";
import { useSettingsStore, FAQItem } from "@/stores/settingsStore"; // Ensure FAQItem is exported from store or defined here if not
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, Edit, GripVertical } from "lucide-react";
import { FaqModal } from "./FaqModal";
import { Switch } from "@/components/ui/switch"; // Import Switch for quick toggle if needed, or remove if only in modal

export function FAQSettingsTab() {
    const { faqs, updateFaqs, isLoading } = useSettingsStore();
    const [localFaqs, setLocalFaqs] = useState<any[]>([]); // Initialize empty
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any | null>(null);

    // Sync from store when loaded
    useEffect(() => {
        if (faqs) {
            setLocalFaqs(faqs);
        }
    }, [faqs]);

    const handleAdd = () => {
        setEditingFaq(null);
        setIsModalOpen(true);
    };

    const handleEdit = (faq: any) => {
        setEditingFaq(faq);
        setIsModalOpen(true);
    };

    const handleDelete = (index: number) => {
        const newFaqs = localFaqs.filter((_, i) => i !== index);
        setLocalFaqs(newFaqs);
    };

    const handleModalSave = (savedFaq: any) => {
        if (editingFaq) {
            // Update existing
            const newFaqs = localFaqs.map(f => f.id === savedFaq.id ? savedFaq : f);
            setLocalFaqs(newFaqs);
        } else {
            // Add new
            setLocalFaqs([...localFaqs, savedFaq]);
        }
    };

    const handleSave = () => {
        // Prepare payload, ensure order matches current list
        const payload = localFaqs.map((f, index) => ({
            ...f,
            order: index + 1 // Re-index order based on current list position
        }));
        updateFaqs(payload).then(() => toast.success("FAQs actualizadas"));
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
                    <div key={faq.id || index} className="p-4 border rounded-lg bg-card flex items-start gap-4 group">
                        <div className="mt-2 text-muted-foreground cursor-move">
                            <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">{faq.question}</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${faq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {faq.active ? 'Visible' : 'Oculto'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <FaqModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSave={handleModalSave}
                initialData={editingFaq}
            />

            <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Guardar FAQs
            </Button>
        </div>
    );
}
