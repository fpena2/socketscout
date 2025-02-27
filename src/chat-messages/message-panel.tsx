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
import { EmptyMessagesPanel } from './no-messages-warn';
import { selectedChatAtom } from '@/stores/atoms';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

function MessagesPanel() {
  const [selectedChat] = useAtom(selectedChatAtom);
  const [messages, setMessages] = useState([]);
  const [buffer, setBuffer] = useState([]);

  if (!selectedChat) {
    return <EmptyMessagesPanel />;
  }

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      setMessages((prevMessages) => [...prevMessages, ...buffer]);
      setBuffer([]);
    }, 500);
    debouncedUpdate();
  }, [buffer]);

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader />
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
          {/* {Array.from(chatMessages).map(
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
          )} */}
        </Stack>
      </Box>
      <MessagesInput />
    </Sheet>
  );
}

function debounce(func: Function, wait: number) {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export { MessagesPanel };
