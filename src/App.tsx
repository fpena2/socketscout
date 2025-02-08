import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import { MessageApp } from '@/MessageApp';

function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box component='main' className='MainContent' sx={{ flex: 1 }}>
        <MessageApp />
      </Box>
    </CssVarsProvider>
  );
}

export default App;
