import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useState } from "react";
import { toast } from "sonner";
import { Save, Facebook, Instagram, Video, MessageCircle } from "lucide-react";

export function SocialSettingsTab() {
    const { socials, updateSocials, isLoading } = useSettingsStore();
    const [localSocials, setLocalSocials] = useState(socials);

    const handleUpdate = (index: number, field: string, value: any) => {
        const newSocials = [...localSocials];
        newSocials[index] = { ...newSocials[index], [field]: value };
        setLocalSocials(newSocials);
    };

    const handleSave = () => {
        updateSocials(localSocials).then(() => toast.success("Redes sociales actualizadas"));
    };

    const getIcon = (platform: string) => {
        switch (platform) {
            case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
            case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
            case 'tiktok': return <Video className="h-5 w-5 text-black" />; // generic video for tiktok
            case 'whatsapp': return <MessageCircle className="h-5 w-5 text-green-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {localSocials.map((social, index) => (
                <div key={social.platform} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 min-w-[120px]">
                        {getIcon(social.platform)}
                        <span className="capitalize font-medium">{social.platform}</span>
                    </div>
                    <div className="flex-1">
                        <Input
                            value={social.url}
                            onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                            placeholder={`URL de ${social.platform}`}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${index}`} className="cursor-pointer text-sm text-muted-foreground">Vivible</Label>
                        <Switch
                            id={`active-${index}`}
                            checked={social.active}
                            onCheckedChange={(checked) => handleUpdate(index, 'active', checked)}
                        />
                    </div>
                </div>
            ))}
            <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> Guardar Redes
            </Button>
        </div>
    );
}
