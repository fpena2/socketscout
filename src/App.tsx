import { Theme, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';

import ConversationsHeader from './components/conversations-header';
import { ConversationsList } from './components/conversations-list';
import MessagesContainer from './components/messages-container';
import MessagesHeader from './components/messages-header';
import MessagesInput from './components/messages-input';
import { MobileDrawer } from './components/mobile-drawer';
import { ChatArea, Container, Sidebar } from './styled';

const ChatUI: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container>
      {isMobile && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      <Sidebar>
        <ConversationsHeader />
        <ConversationsList />
      </Sidebar>
      <ChatArea>
        <MessagesHeader isMobile={isMobile} onMenuClick={() => setDrawerOpen(true)} />
        <MessagesContainer />
        <MessagesInput />
      </ChatArea>
    </Container>
  );
};

export default ChatUI;
