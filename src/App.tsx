import { CssBaseline, CssVarsProvider } from "@mui/joy";

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
