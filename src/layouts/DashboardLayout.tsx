import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    // Currently, individual pages handle their own MobileLayout/Chrome.
    // This layout serves as a placeholder for future shared dashboard logic
    // (e.g. if we move the Navbar here and use a context for the title).
    return <Outlet />;
}
