import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { SocialSettingsTab } from "@/components/admin/settings/SocialSettingsTab";
import { LegalSettingsTab } from "@/components/admin/settings/LegalSettingsTab";
import { FAQSettingsTab } from "@/components/admin/settings/FAQSettingsTab";
import { Settings as SettingsIcon, Globe, Shield, HelpCircle, Share2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEffect } from "react";

export default function Settings() {
    const { general, uploadLogo, fetchSettings } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <div className="space-y-6">
            <AdminSectionHeader
                title="Configuración del Sistema"
                subtitle="Administra la identidad y contenido de la plataforma"
            />

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto lg:h-12 bg-muted/50 p-1">
                    <TabsTrigger value="general" className="flex gap-2 py-2">
                        <SettingsIcon className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="logos" className="flex gap-2 py-2">
                        <Upload className="h-4 w-4" /> Logos
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex gap-2 py-2">
                        <Share2 className="h-4 w-4" /> Redes
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="flex gap-2 py-2">
                        <Shield className="h-4 w-4" /> Legal
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="flex gap-2 py-2">
                        <HelpCircle className="h-4 w-4" /> FAQs
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="general">
                        <Card>
                            <CardContent className="pt-6">
                                <GeneralSettingsTab />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="logos" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Logos e Identidad</CardTitle>
                                <CardDescription>
                                    Gestiona el logo principal y el favicon del sitio.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-muted/20 relative overflow-hidden">
                                        {general.logo ? (
                                            <img src={general.logo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sin Logo</span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Logo Principal</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadLogo(file, 'logo');
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Recomendado: PNG transparente, 500x500px. Max 2MB.
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-muted/20 relative overflow-hidden">
                                        {general.favicon ? (
                                            <img src={general.favicon} alt="Favicon" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sin Favicon</span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Favicon</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadLogo(file, 'favicon');
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Recomendado: ICO o PNG, 32x32px. Max 1MB.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="social">
                        <Card>
                            <CardContent className="pt-6">
                                <SocialSettingsTab />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="legal">
                        <Card>
                            <CardContent className="pt-6">
                                <LegalSettingsTab />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faq">
                        <Card>
                            <CardContent className="pt-6">
                                <FAQSettingsTab />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
