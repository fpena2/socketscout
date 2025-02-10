import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import { listen } from '@tauri-apps/api/event';

import { ChatsPane } from '@/components/ui/chat';
import { MessagesPane } from '@/components/ui/messages';
import {
  Chat,
  ServerEventMessage,
  ServerEventDisconnected,
  ServerEventConnected,
} from '@/types';

function MessageApp() {
  const [chats, setChats] = React.useState<Set<Chat>>(new Set());
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);

  listen<ServerEventConnected>('server-connected', (event) => {
    // NOTE: somehow typescript shows an error here when accessing the event payload
    let chat = event.payload.data.name as Chat;
    // console.log('server-event-connected chat:' , chat);
    setChats((prev) => new Set([...prev, chat]));
  });

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
        <ChatsPane
          chats={Array.from(chats)}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </Sheet>
      <MessagesPane chat={selectedChat} />
    </Sheet>
  );
}

export { MessageApp };
