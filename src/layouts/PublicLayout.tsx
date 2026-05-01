import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/navigation/PublicFooter";
import { PullToRefresh } from "@/components/shared/PullToRefresh";

export default function PublicLayout() {
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PublicNavbar />
            <main className="flex-1 pt-[112px] md:pt-16">
                <PullToRefresh className={`max-w-screen-xl mx-auto px-0 sm:px-6 lg:px-8 ${isLandingPage ? 'py-2 md:py-4' : 'py-8 md:py-12'}`}>
                    <Outlet />
                </PullToRefresh>
            </main>
            <PublicFooter />
        </div>
    );
}
