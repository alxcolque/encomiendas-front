import { AdminSectionHeader } from "@/components/admin/shared/AdminSectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { SocialSettingsTab } from "@/components/admin/settings/SocialSettingsTab";
import { LegalSettingsTab } from "@/components/admin/settings/LegalSettingsTab";
import { FAQSettingsTab } from "@/components/admin/settings/FAQSettingsTab";
import { Settings as SettingsIcon, Globe, Shield, HelpCircle, Share2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
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

                    <TabsContent value="logos">
                        <Card>
                            <CardContent className="pt-6 min-h-[300px] flex items-center justify-center text-muted-foreground">
                                <div className="text-center space-y-2">
                                    <Upload className="h-12 w-12 mx-auto opacity-20" />
                                    <p>Gestor de Archivos / Logos en construcción</p>
                                    <Button variant="outline">Subir Logo Principal</Button>
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
