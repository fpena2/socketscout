import { Avatar, Badge, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { invoke } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { chatsAtom, selectedChatAtom } from '@/stores/atoms';
import { ConversationCmdType } from '@/types';

export const ConversationsList: React.FC = () => {
  const [chats, setChats] = useAtom(chatsAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);

  useEffect(() => {
    invoke<ConversationCmdType[]>('cmd_get_conversations')
      .then((response) => {
        const chatsMap = new Map<string, ConversationCmdType>();
        response.forEach((chat) => {
          chatsMap.set(chat.uuid, chat);
        });
        setChats(chatsMap);
      })
      .catch((error) => {
        console.error('Failed to fetch chats:', error);
      });
  }, [chats]);

  return (
    <List>
      {Array.from(chats.values()).map((convo) => (
        <ListItemButton
          key={convo.uuid}
          onClick={() => {
            setSelectedChat(convo);
          }}
        >
          <ListItemAvatar>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant='dot'
              color={convo.online ? 'success' : 'error'}
            >
              <Avatar src={`https://${convo.avatar}`} alt={convo.peer} />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={convo.peer}
            secondary={convo.uuid}
            slotProps={{ primary: { style: { fontWeight: 500 } } }}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
