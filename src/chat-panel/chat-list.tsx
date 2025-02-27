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
import { useAtom } from 'jotai';
import { chatsAtom, selectedChatAtom } from '@/stores/atoms';

function ChatList() {
  const [chats] = useAtom(chatsAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  console.log(chats);

  if (Array.from(chats.values()).length == 0) {
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
      {Array.from(chats.values()).map((chat: Chat, index: number) => {
        // We have to use self and the "previous" chat to determine if this element
        // is currently selected.
        const isSelected =
          selectedChat !== null && chat.uuid === selectedChat.uuid;
        return (
          <ChatListItem key={index} thisChat={chat} isSelected={isSelected} />
        );
      })}
    </List>
  );
}

export { ChatList };
