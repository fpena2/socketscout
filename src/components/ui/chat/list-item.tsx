import CircleIcon from '@mui/icons-material/Circle';
import * as React from 'react';
import {
  Avatar,
  Box,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
  List,
} from '@mui/joy';

import { ChatProps, MessageProps, UserProps } from '@/types';

type ChatListProps = {
  chats: ChatProps[];
  selectedChat: ChatProps | null;
  setSelectedChat: (chat: ChatProps) => void;
};

function ChatList(props: ChatListProps) {
  const { chats, selectedChat, setSelectedChat } = props;
  return (
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
          // TODO: Fix the error
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      ))}
    </List>
  );
}

type ChatListItemProps = ListItemButtonProps & {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
  selectedChat?: ChatProps;
  setSelectedChat: (chat: ChatProps) => void;
};

function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages, selectedChat, setSelectedChat } = props;
  const selected = selectedChat?.id === id;
  const latestMessage = messages[0]; // Get the latest message safely

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setSelectedChat({ id, sender, messages });
          }}
          selected={selected}
          color='neutral'
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction='row' spacing={1.5}>
            <Avatar src={sender.avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography level='title-sm'>{sender.name}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
              {latestMessage?.unread && (
                <CircleIcon sx={{ fontSize: 12 }} color='primary' />
              )}
              <Typography
                level='body-xs'
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                5 mins ago
              </Typography>
            </Box>
          </Stack>
          <Typography
            level='body-sm'
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {latestMessage?.content}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}

export { ChatList };
