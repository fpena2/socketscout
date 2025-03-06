import { Message, MessageBubble, MessageContainer } from '@/styled';
import { Typography } from '@mui/material';
import { BsCheck2All } from 'react-icons/bs';
import { messages } from './mock-data';
import { selectedChatAtom } from '@/stores/atoms';
import { useAtom } from 'jotai';

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
