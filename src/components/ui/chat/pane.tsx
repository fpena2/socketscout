import { Box, Chip, Input, List, Sheet, Stack, Typography } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { ChatProps } from '../../../types/types';
import { ChatListItem, ChatNewConnection } from '.';

type ChatsPaneProps = {
  chats: ChatProps[];
  setSelectedChat: (chat: ChatProps) => void;
  selectedChatId: string;
};

function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId } = props;
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
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
          />
        ))}
      </List>
    </Sheet>
  );
}

export { ChatsPane };
