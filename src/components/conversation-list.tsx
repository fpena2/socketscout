import { Avatar, Badge, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { conversations } from './mock-data';

export const ConversationsList: React.FC = () => (
  <List>
    {conversations.map((convo) => (
      <ListItemButton key={convo.uuid}>
        <ListItemAvatar>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant='dot'
            color={convo.online ? 'success' : 'error'}
          >
            <Avatar src={`https://${convo.avatar}`} alt={convo.peer} />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={convo.peer}
          secondary={convo.uuid}
          slotProps={{ primary: { style: { fontWeight: 500 } } }}
        />
      </ListItemButton>
    ))}
  </List>
);
