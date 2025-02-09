import { Add } from '@mui/icons-material';
import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Option,
  Input,
  Modal,
  ModalDialog,
  Select,
  Stack,
  Box,
  Grid,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/joy';
import React from 'react';
import { establish_connection } from '@/api/status';
import Close from '@mui/icons-material/Close';

const validateIpAddress = (ip: string) => {
  const parts = ip.split('.');
  return (
    parts.length === 4 &&
    parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255 && part.length > 0;
    })
  );
};

const validatePort = (port: number) => {
  return port >= 0 && port <= 65535;
};

function ChatNewConnection() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [connectionType, setCconnectionType] = React.useState('ws://');

  const [ipAddress, setIpAddress] = React.useState('127.0.0.1');
  const [ipError, setIpError] = React.useState<boolean>(false);

  const [port, setPort] = React.useState<number>(8080);
  const [portError, setPortError] = React.useState<boolean>(false);

  const [connectionError, setConnectionError] = React.useState<string | null>(null);

  const dismissError = () => {
    setConnectionError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateIpAddress(ipAddress)) {
      return;
    }
    try {
      const url = new URL(connectionType + ipAddress + ':' + port);
      await establish_connection(url);
      setOpen(false);
      console.log(url);
    } catch (error: any) {
      setConnectionError(error);
    }
  };

  const handleIpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIp = event.target.value;
    setIpAddress(newIp);
    setIpError(!validateIpAddress(newIp));
  };

  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPort = parseInt(event.target.value, 10);
    setPort(newPort);
    setPortError(!validatePort(newPort));
  };

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
          {connectionError && (
            <Alert
              variant="soft"
              color="danger"
              sx={{ mb: 2 }}
              endDecorator={
                <IconButton
                  variant="plain"
                  onClick={dismissError}
                  sx={{
                    '--IconButton-size': '32px',
                    transform: 'translate(0.5rem, -0.5rem)',
                  }}
                >
                  <Close />
                </IconButton>
              }
            >
              {connectionError}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Grid container spacing={1}>
                <Grid>
                  <Input
                    autoFocus
                    required
                    placeholder='IP Address'
                    value={ipAddress}
                    onChange={handleIpChange}
                    error={ipError}
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
                </Grid>
                <Grid>
                  <Input
                    required
                    placeholder='Port'
                    value={port}
                    onChange={handlePortChange}
                    error={portError}
                  />
                </Grid>
              </Grid>
              <Button type='submit'>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export { ChatNewConnection };
