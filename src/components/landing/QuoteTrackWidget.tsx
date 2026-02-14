import { useState } from "react";
import { Calculator, Search, MapPin, Package, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useNavigate } from "react-router-dom";

export default function QuoteTrackWidget() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleQuote = () => {
    // Mock quote calculation
    alert(`Cotización para envío de ${weight}kg desde ${origin} a ${destination}: Bs. ${Math.floor(Math.random() * 100 + 50)}`);
  };

  const handleTrack = () => {
    if (trackingCode) {
      navigate(`/tracking?code=${trackingCode}`);
    }
  };

  return (
    <div className="glass-card p-1 w-full max-w-md mx-auto lg:mx-0">
      <Tabs defaultValue="quote" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger 
            value="quote" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Cotizar
          </TabsTrigger>
          <TabsTrigger 
            value="track" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Rastrear
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quote" className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-foreground text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Origen
            </Label>
            <Input
              id="origin"
              placeholder="Ciudad de origen"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-foreground text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-destructive" />
              Destino
            </Label>
            <Input
              id="destination"
              placeholder="Ciudad de destino"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-foreground text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              Peso (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <Button
            onClick={handleQuote}
            disabled={!origin || !destination || !weight}
            className="w-full h-12 bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,45%)] text-white font-bold text-base"
          >
            Calcular Precio
          </Button>
        </TabsContent>

        <TabsContent value="track" className="p-4 space-y-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Ingresa tu número de guía para rastrear tu envío en tiempo real
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracking" className="text-foreground text-sm">
              Número de Guía
            </Label>
            <Input
              id="tracking"
              placeholder="Ej: KLM-2024-001234"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              className="bg-background/50 text-center font-mono"
            />
          </div>

          <Button
            onClick={handleTrack}
            disabled={!trackingCode}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base"
          >
            Localizar Paquete
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
