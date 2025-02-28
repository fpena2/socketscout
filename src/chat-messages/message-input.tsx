import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import * as React from 'react';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { invoke } from '@tauri-apps/api/core';
import { selectedChatAtom } from '@/stores/atoms';
import { useAtom } from 'jotai';
import { ChatMessage } from '@/types';

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

function MessagesInput() {
  const [selectedChat] = useAtom(selectedChatAtom);
  const [textAreaValue, setTextAreaValue] = React.useState<string>('');

  const handleClick = () => {
    if (textAreaValue.trim() !== '') {
      let uuid = selectedChat?.uuid;
      let message: ChatMessage = {
        chat_uuid: uuid ?? '',
        sender: 'You',
        receiver: 'Server',
        content: textAreaValue,
        timestamp: new Date().toISOString(),
      };
      invoke('cmd_send_message', { uuid, message });
      setTextAreaValue('');
    }
  };
  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder='Type something here…'
          aria-label='Message'
          onChange={(event) => {
            setTextAreaValue(event.target.value);
          }}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction='row'
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexGrow: 1,
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <div style={{ flexGrow: 1 }} />
              <Button
                size='sm'
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 50,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}

// textAreaValue={textAreaValue}
// setTextAreaValue={setTextAreaValue}
// onSubmit={() => {
//   setChatMessages((prev) => {
//     const newMessages = new Set(prev);
//     newMessages.add({
//       chat_uuid: '0',
//       sender: 'You',
//       receiver: 'Server',
//       content: textAreaValue,
//       timestamp: new Date().toISOString(),
//     });
//     return newMessages;
//   });
// }}

export { MessagesInput };
