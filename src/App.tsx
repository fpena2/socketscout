import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { IoMenu, IoSend } from 'react-icons/io5';
import { RiRadioButtonLine } from 'react-icons/ri';

import { invoke } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import { ConversationsList } from './components/conversation-list';
import { conversations, messages } from './components/mock-data';
import {
  ChatArea,
  ChatHeader,
  Container,
  InputArea,
  Message,
  MessageBubble,
  MessageContainer,
  Sidebar,
} from './components/styled';
import { chatsAtom } from './stores/atoms';
import { ConversationCmdType } from './types';

const ChatUI: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [chats, setChats] = useAtom(chatsAtom);
  React.useEffect(() => {
    invoke<ConversationCmdType[]>('cmd_get_conversations_list')
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
  }, []);

  const handleSend = (): void => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  const handleNewConversation = (): void => {
    // Handle creating a new chat
  };

  return (
    <Container>
      {isMobile && (
        <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box width={320}>
            <ConversationsList />
          </Box>
        </Drawer>
      )}
      <Sidebar>
        <Stack direction='row' justifyContent='space-between' sx={{ p: 2.3 }}>
          <Typography variant='h5'>Conversations</Typography>
          <Button variant='contained' onClick={handleNewConversation}>
            New
          </Button>
        </Stack>
        <ConversationsList />
      </Sidebar>
      <ChatArea>
        <ChatHeader>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} aria-label='open contacts'>
              <IoMenu />
            </IconButton>
          )}
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant='dot'
            color='success'
          >
            <Avatar src={`https://${conversations[0].avatar}`} alt={conversations[0].peer} />
          </Badge>
          <Box>
            <Typography variant='h6'>{conversations[0].peer}</Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RiRadioButtonLine color={conversations[0].online ? '#4caf50' : '#f44336'} />
              {conversations[0].online ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </ChatHeader>

        <MessageContainer>
          {messages.map((msg) => (
            <Message key={msg.uuid} sent={msg.sent_by_client}>
              <MessageBubble sent={msg.sent_by_client} elevation={1}>
                <Typography>{msg.content}</Typography>
                <Typography
                  variant='caption'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: 0.7,
                    marginTop: 4,
                  }}
                >
                  {msg.timestamp}
                  {msg.sent_by_client && <BsCheck2All />}
                </Typography>
              </MessageBubble>
            </Message>
          ))}
        </MessageContainer>

        <InputArea onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Type a message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size='small'
            aria-label='message input'
          />
          <IconButton color='primary' onClick={handleSend} aria-label='send message'>
            <IoSend />
          </IconButton>
        </InputArea>
      </ChatArea>
    </Container>
  );
};

export default ChatUI;
