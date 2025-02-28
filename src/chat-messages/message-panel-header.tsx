import { selectedChatAtom } from '@/stores/atoms';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { invoke } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';

function MessagesPaneHeader() {
  const [selectedChat] = useAtom(selectedChatAtom);

  const handleDisconnect = () => {
    invoke('cmd_close_connection', { uuid: selectedChat?.uuid });
  };

  return (
    <Stack
      direction='row'
      sx={{
        justifyContent: 'space-between',
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body',
      }}
    >
      <Stack
        direction='row'
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: 'center' }}
      >
        <Avatar size='lg' />
        <div>
          <Typography
            component='h2'
            noWrap
            sx={{ fontWeight: 'lg', fontSize: 'lg' }}
          >
            {selectedChat?.address}
          </Typography>
          <Typography level='body-sm'>{selectedChat?.uuid}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
        <IconButton size='sm' variant='plain' color='neutral'>
          <DisabledByDefaultIcon onClick={handleDisconnect} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export { MessagesPaneHeader };
