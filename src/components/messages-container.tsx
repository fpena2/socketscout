import { Typography } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { BsCheck2All } from 'react-icons/bs';

import { selectedChatAtom, selectedChatMessagesAtom } from '@/stores/atoms';
import { Message, MessageBubble, MessageContainer } from '@/styled';
import { MessageCmdType } from '@/types';

const MessagesContainer: React.FC = () => {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [messages, setMessages] = useAtom(selectedChatMessagesAtom);

  useEffect(() => {
    if (!selectedChat) return;

    const unlisten = listen<MessageCmdType[]>('event_new_messages', (event: any) => {
      setMessages((prevMessages) => [...prevMessages, ...event.payload]);
    });

    return () => {
      unlisten.then((f) => f());
      setMessages([]);
    };
  }, [selectedChat]);

  return (
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
  );
};

export default MessagesContainer;
