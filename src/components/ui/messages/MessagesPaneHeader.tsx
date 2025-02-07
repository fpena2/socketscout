import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { UserProps } from '../../../types';
import { toggleMessagesPane } from '../../../utils';

type MessagesPaneHeaderProps = {
  sender: UserProps;
};

function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;
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
        <IconButton
          variant='plain'
          color='neutral'
          size='sm'
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size='lg' src={sender.avatar} />
        <div>
          <Typography
            component='h2'
            noWrap
            sx={{ fontWeight: 'lg', fontSize: 'lg' }}
          >
            {sender.name}
          </Typography>
          <Typography level='body-sm'>{sender.username}</Typography>
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
