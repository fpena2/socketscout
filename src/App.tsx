import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { invoke } from "@tauri-apps/api/core";

import Connections from "./components/Connections";

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Connections />
    </CssVarsProvider>
  );
}

export default App;
