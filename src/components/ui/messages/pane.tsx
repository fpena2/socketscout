import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import * as React from 'react';

import { ChatBubble } from '@/components/ui/chat';
import { MessagesInput, MessagesPaneHeader } from '.';
import { Chat, ChatMessage } from '@/types';

function EmptyMessagesPane() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'text.secondary',
        textAlign: 'center',
      }}
    >
      <p>No messages available. Start the conversation!</p>
    </Box>
  );
}

interface MessagesPaneProps {
  chat: Chat;
}

function MessagesPane({ chat }: MessagesPaneProps) {
  if (!chat || Object.keys(chat).length === 0) {
    return <EmptyMessagesPane />;
  }

  const [chatMessages, setChatMessages] = React.useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader address={chat.address} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {chatMessages.map((message: ChatMessage, index: number) => {
            const isYou = message.sender === 'You';
            return (
              <Stack
                key={index}
                direction='row'
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {message.sender !== 'You' && (
                  <Avatar src={message.senderAvatar} />
                )}
                <ChatBubble {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessagesInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          setChatMessages([
            ...chatMessages,
            {
              // id: newIdString,
              sender: 'You',
              content: textAreaValue,
              timestamp: 'Just now',
            },
          ]);
        }}
      />
    </Sheet>
  );
}

export { MessagesPane };
