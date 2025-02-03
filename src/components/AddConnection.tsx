import * as React from 'react';
import { Box, IconButton, Typography, Sheet, ModalClose, Modal, Button, Input, Stack } from '@mui/joy';

import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

import { new_connection } from '../api/status';


export default function AddConnection() {
    const [open, setOpen] = React.useState<boolean>(false);
    const [url, setUrl] = React.useState<string>('');

    const handleConnect = async () => {
        if (url) {
            const result = await new_connection("ws://" + url);
            console.log("Connection result:", result);
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
                    <Button variant="solid" onClick={handleConnect} fullWidth>
                        Connect
                    </Button>
                </Sheet>
            </Modal>
        </Box>
    );
}
