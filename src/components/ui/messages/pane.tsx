import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import * as React from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

import { ChatBubble } from '@/components/ui/chat';
import { MessagesInput, MessagesPaneHeader } from '.';
import { Chat, ChatMessage, ChatMessageEvent } from '@/types';

interface MessagesPaneProps {
  chat: Chat | null;
}

function MessagesPane({ chat }: MessagesPaneProps) {
  if (!chat || Object.keys(chat).length === 0) {
    return <EmptyMessagesPane />;
  }

  const [chatMessages, setChatMessages] = React.useState<Set<ChatMessage>>(
    new Set(),
  );
  const [textAreaValue, setTextAreaValue] = React.useState<string>('');

  React.useEffect(() => {
    listen<ChatMessageEvent>('chat-message-event', (event) => {
      let event_data: ChatMessageEvent = event.payload.data;
      let message: ChatMessage = event_data.message;
      if (message.chat_uuid === chat.uuid) {
        setChatMessages((prev) => {
          const newMessages = new Set(prev);
          newMessages.add(message);
          return newMessages;
        });
      }
    });
  }, [chat.uuid]);

  console.log(Array.from(chatMessages));

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader uuid={chat.uuid} address={chat.address} />
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
          {Array.from(chatMessages).map(
            (message: ChatMessage, index: number) => {
              const isYou = message.sender === 'You';
              return (
                <Stack
                  key={index}
                  direction='row'
                  spacing={2}
                  sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
                >
                  {message.sender !== 'You' && <Avatar />}
                  <ChatBubble {...message} />
                </Stack>
              );
            },
          )}
        </Stack>
      </Box>
      <MessagesInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          setChatMessages((prev) => {
            const newMessages = new Set(prev);
            newMessages.add({
              chat_uuid: '0',
              sender: 'You',
              receiver: 'Server',
              content: textAreaValue,
              timestamp: new Date().toISOString(),
            });
            return newMessages;
          });
        }}
      />
    </Sheet>
  );
}

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

export { MessagesPane };
