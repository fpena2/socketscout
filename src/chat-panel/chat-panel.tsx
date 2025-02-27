import { Box, Chip, Input, List, Sheet, Stack, Typography } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { Chat } from '@/types';
import { ChatList } from './chat-list';
import { ChatNewConnection } from './new-chat';
import { chatsAtom, selectedChatAtom } from '@/stores/atoms';
import { useAtom } from 'jotai';

function ChatsPane() {
  const [chats] = useAtom(chatsAtom);
  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        overflowY: 'auto',
      }}
    >
      <Stack
        direction='row'
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component='h1'
          endDecorator={
            <Chip
              variant='soft'
              color='primary'
              size='md'
              slotProps={{ root: { component: 'span' } }}
            >
              {Array.from(chats.values()).length}
            </Chip>
          }
          sx={{
            fontSize: { xs: 'md', md: 'lg' },
            fontWeight: 'lg',
            mr: 'auto',
          }}
        >
          Messages
        </Typography>
        <ChatNewConnection />
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size='sm'
          startDecorator={<SearchRoundedIcon />}
          placeholder='Search'
          aria-label='Search'
        />
      </Box>
      <ChatList />
    </Sheet>
  );
}

export { ChatsPane };
