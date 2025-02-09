import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import { ChatProps } from '@/types';
import { ChatsPane } from '@/components/ui/chat';
import { MessagesPane } from '@/components/ui/messages';

function MessageApp() {
  const [chatsData, setChatsData] = React.useState<ChatProps[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<ChatProps | null>(
    null,
  );

  React.useEffect(() => {
    if (chatsData.length > 0) {
      setSelectedChat(chatsData[0]);
    }
  }, [chatsData]);

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
          chats={chatsData}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </Sheet>
      <MessagesPane chat={selectedChat} />
    </Sheet>
  );
}

export { MessageApp };
