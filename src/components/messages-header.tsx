import { ChatHeader } from '@/styled';
import { Avatar, Badge, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IoMenu } from 'react-icons/io5';
import { RiRadioButtonLine } from 'react-icons/ri';
import { conversations } from './mock-data';

const MessagesHeader: React.FC<{ isMobile: boolean; onMenuClick: () => void }> = ({
  isMobile,
  onMenuClick,
}) => {
  return (
    <ChatHeader>
      {isMobile && (
        <IconButton onClick={() => onMenuClick} aria-label='open contacts'>
          <IoMenu />
        </IconButton>
      )}
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant='dot'
        color='success'
      >
        <Avatar src={`https://${conversations[0].avatar}`} alt={conversations[0].peer} />
      </Badge>
      <Box>
        <Typography variant='h6'>{conversations[0].peer}</Typography>
        <Typography
          variant='body2'
          color='textSecondary'
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <RiRadioButtonLine color={conversations[0].online ? '#4caf50' : '#f44336'} />
          {conversations[0].online ? 'Online' : 'Offline'}
        </Typography>
      </Box>
    </ChatHeader>
  );
};

export default MessagesHeader;
