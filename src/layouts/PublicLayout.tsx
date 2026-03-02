import { Outlet } from "react-router-dom";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/navigation/PublicFooter";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PublicNavbar />
            <main className="flex-1 pt-[112px] md:pt-16">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <Outlet />
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
