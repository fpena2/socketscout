import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { ChatsPane } from '@/chat-panel';
import { MessagesPanel } from '@/chat-messages';
import { Chat, AllChatsEvent } from '@/types';
import { useAtom } from 'jotai';
import { chatsAtom, selectedChatAtom } from '@/stores/atoms';

function MessageApp() {
  const [chats, setChats] = useAtom(chatsAtom);

  React.useEffect(() => {
    invoke<Chat[]>('get_list_of_chats')
      .then((response) => {
        const chatsMap = new Map<string, Chat>();
        response.forEach((chat) => {
          chatsMap.set(chat.uuid, chat);
        });
        setChats(chatsMap);
      })
      .catch((error) => {
        console.error('Failed to fetch chats:', error);
      });
  }, []);

  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', md: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'sticky' },
          transform: {
            xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
            sm: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
          zIndex: 100,
          width: '100%',
          top: 52,
        }}
      >
        <ChatsPane />
      </Sheet>
      <MessagesPanel />
    </Sheet>
  );
}

export { MessageApp };
