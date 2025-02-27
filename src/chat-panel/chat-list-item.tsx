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
import { selectedChatAtom } from '@/stores/atoms';
import { useAtom } from 'jotai';

type ChatListItemProps = ListItemButtonProps & {
  thisChat: Chat;
  isSelected: boolean;
};

function ChatListItem(props: ChatListItemProps) {
  const { thisChat, isSelected } = props;
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  return (
    <React.Fragment>
      <ListDivider inset={'gutter'} sx={{ margin: 0 }} />
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
            <Box sx={{ flex: 1 }}>
              <Typography level='title-sm'>
                Address: {thisChat.address}
              </Typography>
              <Typography level='body-xs'>ID: {thisChat.uuid}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
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
    </React.Fragment>
  );
}

export { ChatListItem };
