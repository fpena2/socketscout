import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import * as React from 'react';

import { ChatBubble } from '@/components/ui/chat';
import { MessagesInput, MessagesPaneHeader } from '.';
import { ChatProps, MessageProps } from '@/types';
import { Typography } from '@mui/joy';

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
      <Typography>No messages available. Open a new connection!</Typography>
    </Box>
  );
}

type MessagesPaneProps = {
  chat: ChatProps | null;
};

function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  if (!chat) {
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
      <MessagesPaneHeader sender={chat.sender} />
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
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === 'You';
            return (
              <Stack
                key={index}
                direction='row'
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {message.sender !== 'You' && (
                  <Avatar src={message.sender.avatar} />
                )}
                <ChatBubble
                  variant={isYou ? 'sent' : 'received'}
                  {...message}
                />
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
              id: newIdString,
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
