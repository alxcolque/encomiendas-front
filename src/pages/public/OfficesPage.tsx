import { MapPin, Phone, Clock } from "lucide-react";

const offices = [
    {
        city: "Oruro",
        address: "Av. 6 de Agosto esq. Bolívar, Zona Central",
        phone: "+591 2 525 2525",
        hours: "Lun - Vie: 08:00 - 18:30 | Sáb: 09:00 - 13:00",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    {
        city: "La Paz",
        address: "Calle Bueno #456, Zona Miraflores",
        phone: "+591 2 222 3333",
        hours: "Lun - Vie: 08:30 - 19:00 | Sáb: 09:00 - 14:00",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
    },
    {
        city: "Cochabamba",
        address: "Av. Ayacucho #789, Edificio Torres",
        phone: "+591 4 444 5555",
        hours: "Lun - Vie: 08:00 - 18:30 | Sáb: 09:00 - 13:00",
        image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800"
    },
    {
        city: "Santa Cruz",
        address: "Av. Banzer 4to Anillo, Centro Empresarial",
        phone: "+591 3 333 6666",
        hours: "Lun - Vie: 08:00 - 19:30 | Sáb: 09:00 - 15:00",
        image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
    }
];

export default function OfficesPage() {
    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-display font-bold">Nuestras Oficinas</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Encuentra la sucursal más cercana a ti. Estamos presentes en las principales ciudades del país.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {offices.map((office, index) => (
                    <div key={index} className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300">
                        <div className="h-48 overflow-hidden">
                            <img
                                src={office.image}
                                alt={`Oficina ${office.city}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold">{office.city}</h2>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{office.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Phone className="w-5 h-5 text-primary shrink-0" />
                                    <span>{office.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span>{office.hours}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
