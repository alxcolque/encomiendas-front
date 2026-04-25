import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Clock, Send, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/stores/settingsStore";
import { IOffice } from "@/interfaces/public.interface";
import { PublicService } from "@/services/public.service";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ContactSection() {
  const { general } = useSettingsStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<IOffice[]>([]);
  const [mapLoading, setMapLoading] = useState(true);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      alert("¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  // Fetch offices for the map
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const data = await PublicService.getOffices();
        setOffices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setMapLoading(false);
      }
    };
    fetchOffices();
  }, []);

  // Map initialization
  const defaultCenter: [number, number] = [-16.2902, -63.5887];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapLoading) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 5,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers (if any other than tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for offices
    offices.forEach((office) => {
      if (office.coordinates) {
        const parts = office.coordinates.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0].trim());
          const lng = parseFloat(parts[1].trim());
          if (!isNaN(lat) && !isNaN(lng)) {
            const popupContent = `
                        <div style="font-family: inherit; min-width: 150px;">
                            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${office.name}</div>
                            <div style="font-size: 12px; color: #4b5563;">${office.address}</div>
                            <div style="font-size: 12px; font-weight: 500; margin-top: 4px;">${office.city.name}</div>
                        </div>
                    `;
            L.marker([lat, lng]).bindPopup(popupContent).addTo(map);
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [offices, mapLoading]);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      lines: [general.address || "Oruro, Bolivia"],
    },
    {
      icon: Phone,
      title: "Teléfono",
      lines: [general.supportPhone || "+591 67239563"],
    },
    {
      icon: Mail,
      title: "Email",
      lines: [general.supportEmail || "contacto@kolmox.com.bo"],
    }
  ];

  return (
    <section id="contacto" className="py-8 md:py-16 bg-muted/30 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contáctanos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}


          {/* Contact Info & Map */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="glass-card p-4 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {info.title}
                    </h3>
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>


          </div>
          {/* Map */}
          <div className="glass-card p-2 h-64 overflow-hidden relative z-0">
            {mapLoading ? (
              <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center">
                <div className="loading-logo-section"></div>
              </div>
            ) : (
              <div className="w-full h-full rounded-xl overflow-hidden relative z-0">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
