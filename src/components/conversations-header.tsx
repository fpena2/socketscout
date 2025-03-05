import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import NewConversation from './add-conversation';

const ConversationsHeader: React.FC = () => (
  <Stack direction='row' justifyContent='space-between' sx={{ p: 2.5 }}>
    <Typography variant='h6'>Conversations</Typography>
    <NewConversation />
  </Stack>
);

export default ConversationsHeader;
