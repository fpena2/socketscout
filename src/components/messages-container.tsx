import { Typography } from '@mui/material';
import { listen } from '@tauri-apps/api/event';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { BsCheck2All } from 'react-icons/bs';

import { selectedChatAtom, selectedChatMessagesAtom } from '@/stores/atoms';
import { Message, MessageBubble, MessageContainer } from '@/styled';
import { MessageCmdType } from '@/types';
import { invoke } from '@tauri-apps/api/core';

const MessagesContainer: React.FC = () => {
  const [selectedChat] = useAtom(selectedChatAtom);
  const [messages, setMessages] = useAtom(selectedChatMessagesAtom);

  const fetchHistory = async () => {
    try {
      const history = await invoke<MessageCmdType[]>('cmd_get_conversation_messages', {
        uuid: selectedChat?.uuid,
      });
      setMessages(history);
    } catch (error) {
      console.error('Failed to fetch conversation history:', error);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;

    fetchHistory();

    const unlisten = listen<MessageCmdType[]>('event_new_messages', (event: any) => {
      setMessages((prevMessages) => {
        const newMessages = event.payload.filter(
          (newMsg: MessageCmdType) => !prevMessages.some((prevMsg) => prevMsg.uuid === newMsg.uuid),
        );
        return [...prevMessages, ...newMessages];
      });
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
