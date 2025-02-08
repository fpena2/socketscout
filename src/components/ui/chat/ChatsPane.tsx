// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  Button,
  Chip,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Option,
  Input,
  Modal,
  ModalDialog,
  Select,
} from '@mui/joy';
import List from '@mui/joy/List';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { ChatProps } from '../../../types/types';
// import { toggleMessagesPane } from '../../../utils';
import ChatListItem from './ChatListItem';
import { Add } from '@mui/icons-material';
import React from 'react';

type ChatsPaneProps = {
  chats: ChatProps[];
  setSelectedChat: (chat: ChatProps) => void;
  selectedChatId: string;
};

function NewMessage() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [connectionType, setCconnectionType] = React.useState('ws://');
  return (
    <React.Fragment>
      <Button
        variant='outlined'
        color='neutral'
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        New Connection
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Connect to new server</DialogTitle>
          <DialogContent>Fill in the information of the server.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <Input
                  autoFocus
                  required
                  placeholder='IP Address'
                  startDecorator={
                    <React.Fragment>
                      <Select
                        variant='plain'
                        value={connectionType}
                        onChange={(_, value) => setCconnectionType(value!)}
                      >
                        <Option value='ws://'>ws://</Option>
                        <Option value='sws://'>sws://</Option>
                      </Select>
                      <Divider orientation='vertical' />
                    </React.Fragment>
                  }
                />
              </FormControl>
              <Button type='submit'>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId } = props;
  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        overflowY: 'auto',
      }}
    >
      <Stack
        direction='row'
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component='h1'
          endDecorator={
            <Chip
              variant='soft'
              color='primary'
              size='md'
              slotProps={{ root: { component: 'span' } }}
            >
              4
            </Chip>
          }
          sx={{
            fontSize: { xs: 'md', md: 'lg' },
            fontWeight: 'lg',
            mr: 'auto',
          }}
        >
          Messages
        </Typography>
        <NewMessage />
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size='sm'
          startDecorator={<SearchRoundedIcon />}
          placeholder='Search'
          aria-label='Search'
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
          />
        ))}
      </List>
    </Sheet>
  );
}
