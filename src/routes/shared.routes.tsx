import { Route } from "react-router-dom";
import RankingPage from "@/pages/driver/Ranking";
import WalletPage from "@/pages/driver/Wallet";
import InvoicePage from "@/pages/shared/InvoicePage";

export const SharedRoutes = (
    <>
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/profile" element={<WalletPage />} />
        <Route path="/shipments/:id/invoice" element={<InvoicePage />} />
    </>
);
