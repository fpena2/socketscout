import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import * as React from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

import { ChatBubble } from './message-bubble';
import { MessagesInput, MessagesPaneHeader } from '.';
import { Chat, ChatMessage, ChatMessageEvent } from '@/types';
import ConfusedPerson from '@/components/icons/confused-person';
import { Typography } from '@mui/joy';

interface MessagesPaneProps {
  selectedChat: Chat | null;
}

function MessagesPanel({ selectedChat }: MessagesPaneProps) {
  if (!selectedChat || Object.keys(selectedChat).length === 0) {
    return <EmptyMessagesPanel />;
  }

  const [chatMessages, setChatMessages] = React.useState<Set<ChatMessage>>(
    new Set(),
  );
  const [textAreaValue, setTextAreaValue] = React.useState<string>('');

  React.useEffect(() => {
    listen<ChatMessageEvent>('chat-message-event', (event) => {
      let event_data: ChatMessageEvent = event.payload.data;
      let message: ChatMessage = event_data.message;
      if (message.chat_uuid === selectedChat.uuid) {
        console.log(message.chat_uuid + '===' + selectedChat.uuid);
        setChatMessages((prev) => {
          const newMessages = new Set(prev);
          newMessages.add(message);
          return newMessages;
        });
      }
    });
  }, [selectedChat.uuid]);

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
      <MessagesPaneHeader
        uuid={selectedChat.uuid}
        address={selectedChat.address}
      />
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

function EmptyMessagesPanel() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2%',
      }}
    >
      <ConfusedPerson />
      <Typography>Select or start a new connection.</Typography>
    </Box>
  );
}

export { MessagesPanel };
