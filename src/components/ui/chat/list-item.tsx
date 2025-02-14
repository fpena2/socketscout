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

import { Chat } from '@/types';

type ChatListProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
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
      {chats &&
        chats.length > 0 &&
        chats.map((chat: Chat, index: number) => {
          // We have to use self and the "previous" chat to determine if this element
          // is currently selected.
          const isSelected =
            selectedChat !== null && chat.uuid === selectedChat.uuid;
          return (
            <ChatListItem
              key={index}
              thisChat={chat}
              isSelected={isSelected}
              setSelectedChat={setSelectedChat}
            />
          );
        })}
    </List>
  );
}

type ChatListItemProps = ListItemButtonProps & {
  thisChat: Chat;
  isSelected: boolean;
  setSelectedChat: (chat: Chat) => void;
};

function ChatListItem(props: ChatListItemProps) {
  const { thisChat, isSelected, setSelectedChat } = props;
  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setSelectedChat(thisChat);
          }}
          selected={isSelected}
          color='neutral'
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction='row' spacing={1.5}>
            {/* <Avatar src={self.senderAvatar} /> */}
            <Box sx={{ flex: 1 }}>
              <Typography level='title-sm'>{thisChat.address}</Typography>
              <Typography level='title-sm'>{thisChat.uuid}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
              {/* {latestMessage?.unread && (
                <CircleIcon sx={{ fontSize: 12 }} color='primary' />
              )} */}
              <Typography
                level='body-xs'
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                5 mins ago
              </Typography>
            </Box>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}

export { ChatList };
