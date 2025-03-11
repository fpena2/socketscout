import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import NewConversation from './add-conversation';

const ConversationsHeader: React.FC = () => (
  <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ p: 2.1 }}>
    <Typography
      variant='h6'
      sx={{
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* "Connection" seems better for the UI, but "Conversation" makes more sense.*/}
      Connections
    </Typography>
    <NewConversation />
  </Stack>
);

export default ConversationsHeader;
