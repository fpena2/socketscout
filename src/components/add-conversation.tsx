import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { invoke } from '@tauri-apps/api/core';
import { DialogProps, DialogsProvider, useDialogs } from '@toolpad/core/useDialogs';

interface TransferFormData {
  ws_server: string;
  ws_port: string;
  ws_uri: string;
}

const FormContext = React.createContext<{
  formData: TransferFormData;
  setFormData: (data: TransferFormData) => void;
} | null>(null);

function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

function TransactionDialog({
  payload,
  open,
  onClose,
}: DialogProps<{ component: React.ReactNode; data: string }, string | null>) {
  const [loading, setLoading] = React.useState(false);
  const { formData } = useFormContext();

  const isValidCsrf = React.useMemo(() => {
    if (payload.data) {
      return true;
    }
    return false;
  }, [payload.data]);

  return (
    <Dialog fullWidth open={open} onClose={() => onClose(null)}>
      <DialogTitle>Confirm new connection</DialogTitle>
      <DialogContent>{payload.component}</DialogContent>
      <DialogActions>
        <Button
          loading={loading}
          disabled={!isValidCsrf || loading}
          onClick={async () => {
            setLoading(true);
            try {
              const address = `ws://${formData.ws_server}:${formData.ws_port}${formData.ws_uri}`;
              const uuid = await invoke<string>('cmd_open_conversation', {
                address: address,
              });
              onClose(uuid);
            } catch (error) {
              console.error('Error establishing connection:', error);
            } finally {
              setLoading(false);
            }
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Payload() {
  const { formData, setFormData } = useFormContext();
  return (
    <Stack spacing={2} padding={1}>
      <TextField
        label='Server URL'
        value={formData.ws_server}
        onChange={(event) => setFormData({ ...formData, ws_server: event.target.value })}
      />
      <TextField
        label='Server Port'
        value={formData.ws_port}
        onChange={(event) => setFormData({ ...formData, ws_port: event.target.value })}
      />
      <TextField
        label='Server URI'
        value={formData.ws_uri}
        onChange={(event) => setFormData({ ...formData, ws_uri: event.target.value })}
      />
    </Stack>
  );
}

function DialogContainer() {
  const dialogs = useDialogs();
  const csrfToken = crypto.randomUUID();
  return (
    <IconButton
      aria-label='add new conversation'
      color='success'
      onClick={async () => {
        // preview-start
        const uuid = await dialogs.open(TransactionDialog, {
          component: <Payload />,
          data: csrfToken,
        });
        // preview-end
        if (uuid) {
          dialogs.alert(`Server connection completed with ID: ${uuid}`, {
            title: 'Success',
          });
        }
      }}
    >
      <AddIcon />
    </IconButton>
  );
}

export default function NewConversation() {
  const [formData, setFormData] = React.useState<TransferFormData>({
    ws_server: '127.0.0.1',
    ws_port: '8080',
    ws_uri: '/',
  });

  const contextValue = React.useMemo(() => ({ formData, setFormData }), [formData]);

  return (
    <FormContext.Provider value={contextValue}>
      <DialogsProvider>
        <DialogContainer />
      </DialogsProvider>
    </FormContext.Provider>
  );
}
