import { selectedChatAtom } from '@/stores/atoms';
import { InputArea } from '@/styled';
import { MessageCmdType } from '@/types';
import { IconButton, TextField } from '@mui/material';
import { invoke } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const MessagesInput: React.FC = () => {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [message, setMessage] = useState<string>('');

  const handleSend = async (value: string): Promise<void> => {
    if (value.trim() && selectedChat) {
      try {
        let newMessage: MessageCmdType = {
          uuid: '',
          content: value,
          timestamp: '',
          sent_by_client: true,
        };

        await invoke('cmd_send_conversation_message', {
          uuid: selectedChat.uuid,
          message: newMessage,
        });

        setMessage(''); // Clear the input after sending
      } catch (error) {
        console.error('Failed to send message:', error);
      }
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
      <IconButton
        color='primary'
        aria-label='send message'
        onClick={async (e) => {
          e.preventDefault();
          await handleSend(message);
        }}
      >
        <IoSend />
      </IconButton>
    </InputArea>
  );
};

export default MessagesInput;
