import { Providers } from "./providers";
import { AppRouter } from "./router";
import "./App.css";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";

const App = () => {
  const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
  const fetchPublicSettings = useSettingsStore(state => state.fetchPublicSettings);

  useEffect(() => {
    checkAuthStatus();
    fetchPublicSettings();
  }, [checkAuthStatus, fetchPublicSettings]);

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
};

export default App;
