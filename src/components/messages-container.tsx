import { Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { BsCheck2All } from 'react-icons/bs';

import { selectedChatAtom } from '@/stores/atoms';
import { Message, MessageBubble, MessageContainer } from '@/styled';
import { messages } from './mock-data';

const MessagesContainer: React.FC = () => {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
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
