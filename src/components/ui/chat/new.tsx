import { Add } from '@mui/icons-material';
import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Option,
  FormControl,
  Input,
  Modal,
  ModalDialog,
  Select,
  Stack,
} from '@mui/joy';
import React from 'react';

function ChatNewConnection() {
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

export { ChatNewConnection };
