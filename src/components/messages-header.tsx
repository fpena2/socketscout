import { selectedChatAtom } from '@/stores/atoms';
import { ChatHeader } from '@/styled';
import { Avatar, Badge, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import { IoMenu } from 'react-icons/io5';
import { RiRadioButtonLine } from 'react-icons/ri';

const MessagesHeader: React.FC<{ isMobile: boolean; onMenuClick: () => void }> = ({
  isMobile,
  onMenuClick,
}) => {
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
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
        <Avatar src={`https://${selectedChat?.avatar}`} alt={selectedChat?.peer} />
      </Badge>
      <Box>
        <Typography variant='h6'>{selectedChat?.peer}</Typography>
        <Typography
          variant='body2'
          color='textSecondary'
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <RiRadioButtonLine color={selectedChat?.online ? '#4caf50' : '#f44336'} />
          {selectedChat?.online ? 'Online' : 'Offline'}
        </Typography>
      </Box>
    </ChatHeader>
  );
};

export default MessagesHeader;
