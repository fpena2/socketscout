import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import MyMessages from './components/MyMessages';

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box component="main" className="MainContent" sx={{ flex: 1 }}>
        <MyMessages />
      </Box>
    </CssVarsProvider>
  );
}

export default App;
