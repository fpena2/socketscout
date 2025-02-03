import * as React from 'react';
import { Box, Chip, IconButton, Input, List, Typography, Sheet, Stack } from '@mui/joy';

import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { active_connections } from '../api/status';
import AddConnection from './AddConnection';


export default function ConnectionsPane() {
    const [activeConnections, setActiveConnections] = React.useState(0);
    React.useEffect(() => {
        const fetchConnections = async () => {
            setActiveConnections(await active_connections());
        };

        fetchConnections();
    }, []);

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
                    endDecorator={
                        <Chip color="primary">
                            {activeConnections}
                        </Chip>
                    }
                    sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
                >
                    Connections
                </Typography>
                <AddConnection />
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
