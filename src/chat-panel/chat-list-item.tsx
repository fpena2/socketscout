import CircleIcon from '@mui/icons-material/Circle';
import * as React from 'react';
import {
  Avatar,
  Box,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
  List,
} from '@mui/joy';

import { Chat } from '@/types';

type ChatListItemProps = ListItemButtonProps & {
  thisChat: Chat;
  isSelected: boolean;
  setSelectedChat: (chat: Chat) => void;
};

function ChatListItem(props: ChatListItemProps) {
  const { thisChat, isSelected, setSelectedChat } = props;
  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setSelectedChat(thisChat);
          }}
          selected={isSelected}
          color='neutral'
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction='row' spacing={1.5}>
            {/* <Avatar src={self.senderAvatar} /> */}
            <Box sx={{ flex: 1 }}>
              <Typography level='title-sm'>{thisChat.address}</Typography>
              <Typography level='title-sm'>{thisChat.uuid}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
              {/* {latestMessage?.unread && (
                  <CircleIcon sx={{ fontSize: 12 }} color='primary' />
                )} */}
              <Typography
                level='body-xs'
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                Connected
              </Typography>
            </Box>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}

export { ChatListItem };
