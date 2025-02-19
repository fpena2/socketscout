import { Box, Typography } from '@mui/joy';
import ConfusedPerson from '@/components/icons/confused-person';

function EmptyMessagesPanel() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2%',
      }}
    >
      <ConfusedPerson />
      <Typography>Select or start a new connection.</Typography>
    </Box>
  );
}

export { EmptyMessagesPanel };
