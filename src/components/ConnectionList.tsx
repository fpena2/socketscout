import * as React from 'react';

import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';

import CircleIcon from '@mui/icons-material/Circle';

type ConnectionListProps = {
    address: string;
    server: {
        name: string;
        online: boolean;
    };
    messages: {
        content: string;
        unread: boolean;
    }[];
    selectedChatId?: string;
    setSelectedChat: (chat: { id: string; server: any; messages: any[] }) => void;
};

const ConnectionList: React.FC<ConnectionListProps> = (props) => {
    const { address, server, messages, selectedChatId, setSelectedChat } = props;
    const selected = selectedChatId === address;

    return (
        <React.Fragment>
            <ListItem>
                <ListItemButton
                    onClick={() => {
                        setSelectedChat({ id: address, server, messages });
                    }}
                    selected={selected}
                    color="neutral"
                    sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
                >
                    <Stack direction="row" spacing={1.5}>
                        <Box sx={{ flex: 1 }}>
                            <Typography level="title-sm">{server.name}</Typography>
                        </Box>
                        <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
                            {messages[0].unread && (
                                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
                            )}
                            <Typography
                                level="body-xs"
                                noWrap
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            >
                                5 mins ago {/* You can replace this with actual timestamp */}
                            </Typography>
                        </Box>
                    </Stack>
                    <Typography
                        level="body-sm"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {messages[0].content}
                    </Typography>
                </ListItemButton>
            </ListItem>
            <ListDivider sx={{ margin: 0 }} />
        </React.Fragment>
    );
};

export { ConnectionList };
