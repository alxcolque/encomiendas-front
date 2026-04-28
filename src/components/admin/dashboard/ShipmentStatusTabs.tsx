import React, { useState, KeyboardEvent, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminShipmentStore } from "@/stores/adminShipmentStore";
import { useShipmentScannerStore } from "@/stores/scannerStore";
import { RecentShipmentsTable } from "./RecentShipmentsTable";
import { Input } from "@/components/ui/input";
import { ScanLine } from "lucide-react";
import { ShipmentStatus } from "@/interfaces/shipment.interface";

const statuses: { id: ShipmentStatus; label: string }[] = [
    { id: 'quote', label: 'Cotizado' },
    { id: 'created', label: 'Creado' },
    { id: 'in_transit', label: 'En Tránsito' },
    { id: 'at_office', label: 'En Sucursal' },
    { id: 'delivered', label: 'Entregado' }
];

export function ShipmentStatusTabs() {
    const { shipments, fetchShipments } = useAdminShipmentStore();
    const { scanAndUpdateShipment, scanning } = useShipmentScannerStore();
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Fetch shipments when the component mounts to get the latest status
        fetchShipments();
    }, [fetchShipments]);

    // Global listener for Barcode Scanner (YHD-8200DW and others)
    // This auto-focuses the active input if the user scans while clicking somewhere else
    useEffect(() => {
        const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            const isInputTarget = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';
            
            // If it's a normal character stroke and we aren't already in an input
            if (!isInputTarget && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const activeScannerInput = document.querySelector<HTMLInputElement>('[data-state="active"] .scanner-input-field');
                if (activeScannerInput) {
                    activeScannerInput.focus();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            await scanAndUpdateShipment(inputValue);
            setInputValue("");
        }
    };

    return (
        <div className="w-full">
            <Tabs defaultValue="created" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 mb-6">
                    {statuses.map((status) => {
                        const count = shipments.filter(s => s.current_status === status.id).length;
                        return (
                            <TabsTrigger 
                                key={status.id} 
                                value={status.id}
                                className="relative py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                            >
                                <span className="font-semibold">{status.label}</span>
                                {count > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                        {count > 99 ? '99+' : count}
                                    </span>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {statuses.map((status) => {
                    const filteredShipments = shipments.filter(s => s.current_status === status.id);
                    
                    return (
                        <TabsContent key={status.id} value={status.id} className="mt-2 space-y-6">
                            {/* Input for Scanner */}
                            <div className="flex items-center space-x-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <ScanLine className="text-primary w-6 h-6" />
                                </div>
                                <Input 
                                    placeholder="Escanea el código de barras, código QR o escribe manualmente y presiona Enter..." 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={scanning}
                                    autoFocus
                                    className="flex-1 font-mono text-lg bg-background/50 border-primary/20 focus-visible:ring-primary h-12 scanner-input-field"
                                />
                            </div>

                            {/* Table with filtered shipments */}
                            <RecentShipmentsTable 
                                shipments={filteredShipments} 
                                title={`Encomiendas: ${status.label}`}
                                showSearch={true}
                                showViewAll={false}
                            />
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
