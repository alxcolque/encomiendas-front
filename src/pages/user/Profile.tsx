import { useAuthStore } from "@/stores/authStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();

    return (
        <div className="p-4 space-y-6">
            <GlassCard className="flex flex-col items-center py-8">
                <div className="w-24 h-24 rounded-full bg-muted mb-4 overflow-hidden border-4 border-primary/20">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                            <User size={40} />
                        </div>
                    )}
                </div>
                <h2 className="text-xl font-bold">{user?.name || "Usuario"}</h2>
                <p className="text-muted-foreground capitalize">{user?.role || "Invitado"}</p>
                <p className="text-sm text-muted-foreground">{user?.phone}</p>

                <Button
                    variant="destructive"
                    className="mt-6 w-full max-w-xs gap-2"
                    onClick={logout}
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </Button>
            </GlassCard>
        </div>
    );
}
