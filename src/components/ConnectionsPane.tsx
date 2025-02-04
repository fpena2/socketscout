import * as React from 'react';
import { Box, Chip, Input, List, ListItem, Typography, Sheet, Stack, CircularProgress } from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { active_connections } from '../api/status';
import AddConnection from './AddConnection';

export default function ConnectionsPane() {
    const [activeConnections, setActiveConnections] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>("");
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    React.useEffect(() => {
        const fetchConnections = async () => {
            try {
                const connections = await active_connections();
                setActiveConnections(connections);
            } catch (error) {
                setError("Failed to fetch connections.");
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const filteredConnections = activeConnections.filter(connection =>
        connection.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Typography
                        sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
                    >
                        Connections
                    </Typography>
                    <Chip color="primary">
                        {activeConnections.length}
                    </Chip>
                </Stack>

                <AddConnection />
            </Stack>
            <Box sx={{ px: 2, pb: 1.5 }}>
                <Input
                    size="sm"
                    startDecorator={<SearchRoundedIcon />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
            <List
                sx={{
                    py: 0,
                    '--ListItem-paddingY': '0.75rem',
                    '--ListItem-paddingX': '1rem',
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="danger">{error}</Typography>
                ) : (
                    filteredConnections.map((connection, index) => (
                        <ListItem key={index} sx={{ padding: '0.5rem 1rem' }}>
                            <Typography>{connection}</Typography>
                        </ListItem>
                    ))
                )}
            </List>
        </Sheet>
    );
}
