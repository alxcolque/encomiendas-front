import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Trophy, Wallet, Package, User } from "lucide-react";
import { TopNavbar } from "./TopNavbar";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
  showHeader?: boolean;
}

const navItems = [
  { icon: Home, label: "Inicio", path: "/driver" },
  { icon: Package, label: "Activo", path: "/driver/active" },
  { icon: Trophy, label: "Ranking", path: "/ranking" },
  { icon: Wallet, label: "Billetera", path: "/wallet" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function MobileLayout({ 
  children, 
  title, 
  showNav = true, 
  showHeader = true 
}: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      {showHeader && <TopNavbar />}

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto",
        showNav && "pb-20"
      )}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
          <div className="flex justify-around items-center max-w-lg mx-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    isActive && "bg-primary/20 glow-cyan"
                  )}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
