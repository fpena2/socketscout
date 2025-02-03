import * as React from 'react';
import { Box, Chip, IconButton, Input, List, Typography, Sheet, Stack } from '@mui/joy';

import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import ChatListItem from './ChatListItem';
// import { ChatProps } from '../types';
// import { toggleMessagesPane } from '../utils';

// type ConnectionsPaneProps = {
//     chats: ChatProps[];
//     setSelectedConnection: (chat: ChatProps) => void;
//     selectedConnectionId: string;
// };

// props: ConnectionsPaneProps
export default function ConnectionsPane() {
    // const { chats, setSelectedConnection, selectedConnectionId } = props;
    return (
        <Sheet
            sx={{
                borderRight: '1px solid',
                borderColor: 'divider',
                height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
                overflowY: 'auto',
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
            >
                <Typography
                    component="h1"
                    endDecorator={
                        <Chip
                            variant="soft"
                            color="primary"
                            size="md"
                            slotProps={{ root: { component: 'span' } }}
                        >
                            0
                        </Chip>
                    }
                    sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
                >
                    Connections
                </Typography>
                <IconButton
                    variant="plain"
                    aria-label="edit"
                    color="neutral"
                    size="sm"
                    sx={{ display: { xs: 'none', sm: 'unset' } }}
                >
                    <EditNoteRoundedIcon />
                </IconButton>
                <IconButton
                    variant="plain"
                    aria-label="edit"
                    color="neutral"
                    size="sm"
                    onClick={() => {
                        // toggleMessagesPane();
                    }}
                    sx={{ display: { sm: 'none' } }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </Stack>
            <Box sx={{ px: 2, pb: 1.5 }}>
                <Input
                    size="sm"
                    startDecorator={<SearchRoundedIcon />}
                    placeholder="Search"
                    aria-label="Search"
                />
            </Box>
            <List
                sx={{
                    py: 0,
                    '--ListItem-paddingY': '0.75rem',
                    '--ListItem-paddingX': '1rem',
                }}
            >
                {/* {chats.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        {...chat}
                        setSelectedChat={setSelectedChat}
                        selectedChatId={selectedChatId}
                    />
                ))} */}
            </List>
        </Sheet>
    );
}
