import { Paper } from '@mui/material';
import { Box, styled } from '@mui/system';

interface ContainerProps {} // Define props if needed, currently empty
export const Container = styled(Box)<ContainerProps>(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f5f5f5',
}));

interface SidebarProps {} // Define props if needed, currently empty
export const Sidebar = styled(Box)<SidebarProps>(({ theme }) => ({
  width: 320,
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

interface ChatAreaProps {} // Define props if needed, currently empty
export const ChatArea = styled(Box)<ChatAreaProps>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

interface MessageContainerProps {} // Define props if needed, currently empty
export const MessageContainer = styled(Box)<MessageContainerProps>({
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
});

interface MessageProps {
  sent: boolean;
}
export const Message = styled(Box, { shouldForwardProp: (prop) => prop !== 'sent' })<MessageProps>(
  ({ sent }) => ({
    display: 'flex',
    justifyContent: sent ? 'flex-end' : 'flex-start',
    marginBottom: '10px',
  }),
);

interface MessageBubbleProps {
  sent: boolean;
}
export const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'sent',
})<MessageBubbleProps>(({ sent }) => ({
  padding: '10px 15px',
  maxWidth: '70%',
  backgroundColor: sent ? '#1976d2' : '#fff',
  color: sent ? '#fff' : 'inherit',
  borderRadius: '15px',
  position: 'relative',
}));

interface ChatHeaderProps {} // Define props if needed, currently empty
export const ChatHeader = styled(Box)<ChatHeaderProps>({
  padding: '15px',
  backgroundColor: '#fff',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
});

interface InputAreaProps {} // Define props if needed, currently empty
export const InputArea = styled(Box)<InputAreaProps>({
  padding: '20px',
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  display: 'flex',
  gap: '10px',
});
