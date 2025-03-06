import { InputArea } from '@/styled';
import { IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const MessagesInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const handleSend = (): void => {
    if (message.trim()) {
      setMessage('');
    }
  };
  return (
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
  );
};

export default MessagesInput;
