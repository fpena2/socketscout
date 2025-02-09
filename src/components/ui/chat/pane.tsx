import { Box, Chip, Input, List, Sheet, Stack, Typography } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { Chat } from '@/types';
import { ChatList, ChatNewConnection } from '.';

type ChatsPaneProps = {
  chats: Chat[];
  selectedChat: Chat;
  setSelectedChat: (chat: Chat) => void;
};

function ChatsPane(props: ChatsPaneProps) {
  const { chats, selectedChat, setSelectedChat } = props;
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
              4
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
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
    </Sheet>
  );
}

export { ChatsPane };
