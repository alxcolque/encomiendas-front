import { Providers } from "./providers";
import { AppRouter } from "./router";
import "./App.css";

const App = () => (
  <Providers>
    <AppRouter />
  </Providers>
);

export default App;
