import { ReactNode, Fragment } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TopNavbar } from "./TopNavbar";
import { LucideIcon } from "lucide-react";
import { PullToRefresh } from "../shared/PullToRefresh";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface MobileLayoutProps {
  children?: ReactNode;
  navItems?: NavItem[];
  title?: string;
  showNav?: boolean;
  showHeader?: boolean;
  centerAction?: ReactNode;
}

export function MobileLayout({
  children,
  navItems = [],
  title,
  showNav = true,
  showHeader = true,
  centerAction
}: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      {showHeader && <TopNavbar />}

      <main className={cn(
        "flex-1 overflow-x-hidden",
        showNav && navItems.length > 0 && "pb-24"
      )}>
        <PullToRefresh className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children ? children : <Outlet />}
        </PullToRefresh>
      </main>

      {/* Bottom navigation */}
      {showNav && navItems.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
          <div className="flex justify-around items-center max-w-lg mx-auto py-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              // Evitar que las rutas raíz (como /admin) se marquen activas para cualquier subruta
              const isRootPath = ['/', '/admin', '/worker', '/client', '/company', '/partner'].includes(item.path);
              const isActive = location.pathname === item.path || 
                               (!isRootPath && location.pathname.startsWith(item.path + "/"));

              return (
                <Fragment key={item.path}>
                  {/* Insert center action after the 2nd item */}
                  {centerAction && index === 2 && (
                    <div className="flex-shrink-0 -mt-8 relative z-10 scale-110">
                      {centerAction}
                    </div>
                  )}

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
                </Fragment>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
