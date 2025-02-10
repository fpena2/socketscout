import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

interface MessagesPaneHeaderProps {
  uuid: string;
  address: string;
}

function MessagesPaneHeader({ uuid, address }: MessagesPaneHeaderProps) {
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
            {address}
          </Typography>
          <Typography level='body-sm'>{uuid}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
        <IconButton size='sm' variant='plain' color='neutral'>
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export { MessagesPaneHeader };
