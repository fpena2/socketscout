import * as React from 'react';
import { Box, IconButton, Typography, Sheet, ModalClose, Modal, Button, Input, Stack } from '@mui/joy';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

// 127.0.0.1:8080

interface AddConnectionProps {
    onNewConnection: (url: string) => Promise<void>;
}

const AddConnection: React.FC<AddConnectionProps> = ({ onNewConnection }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [url, setUrl] = React.useState<string>('127.0.0.1:8080');
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleConnect = async () => {
        if (url) {
            setLoading(true);
            try {
                await onNewConnection(url);
            } catch (error) {
                console.error("Error in new_connection:", error);
            } finally {
                setLoading(false);
                setOpen(false);
            }
        } else {
            console.warn("URL is required to connect.");
        }
    };

    return (
        <Box>
            <IconButton>
                <EditNoteRoundedIcon onClick={() => setOpen(true)} />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <ModalClose />
                    <Typography
                        level="h4"
                        sx={{ fontWeight: 'lg', mb: 2 }}
                    >
                        Connect to server
                    </Typography>
                    <Stack direction="row" >
                        <Typography sx={{ mt: 0.5, fontSize: "large" }}>
                            ws://
                        </Typography>
                        <Input
                            placeholder="Enter URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            sx={{ mb: 2, ml: 1 }}
                        />
                    </Stack>
                    <Button loading={loading} variant="solid" onClick={handleConnect} fullWidth>
                        {loading ? "Connecting..." : "Connect"}
                    </Button>
                </Sheet>
            </Modal>
        </Box>
    );
}

export { AddConnection };