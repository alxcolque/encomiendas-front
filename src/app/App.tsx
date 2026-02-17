import { Providers } from "./providers";
import { AppRouter } from "./router";
import "./App.css";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const App = () => {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
};

export default App;
