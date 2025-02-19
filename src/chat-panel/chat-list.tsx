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
import { ChatListItem } from './chat-list-item';
import ChatNotFound from '@/components/icons/chat-no-found';

type ChatListProps = {
  chats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
};

function ChatList(props: ChatListProps) {
  const { chats, selectedChat, setSelectedChat } = props;

  if (chats.length == 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh', // FIXME: automatically adjust the height of the left panel
        }}
      >
        <ChatNotFound />
        <Typography>No connections found!</Typography>
      </Box>
    );
  }

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

export { ChatList };
