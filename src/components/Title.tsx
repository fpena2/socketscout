import { Box, Button, IconButton, IconButtonProps, Typography, useColorScheme } from "@mui/joy";
import { useEffect, useState } from "react";

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <IconButton
            aria-label="toggle light/dark mode"
            size="sm"
            variant="outlined"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}

export default function Title() {
    return (
        <Box component="header"
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            <Typography level="title-lg">Socket Scout</Typography>
            <ColorSchemeToggle />
        </Box>
    );
}
