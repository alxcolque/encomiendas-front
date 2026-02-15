import { Route } from "react-router-dom";
import RankingPage from "@/pages/RankingPage";
import WalletPage from "@/pages/WalletPage";

export const SharedRoutes = (
    <>
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/profile" element={<WalletPage />} />
    </>
);
