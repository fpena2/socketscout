import { Drawer } from '@mui/material';
import { Box } from '@mui/system';
import { ConversationsList } from './conversations-list';

const MobileDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Drawer anchor='left' open={open} onClose={onClose}>
    <Box width={320}>
      <ConversationsList />
    </Box>
  </Drawer>
);

export { MobileDrawer };
