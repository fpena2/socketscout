import * as React from 'react';
import Sheet from '@mui/joy/Sheet';

import { ConnectionProps } from './types';

import ConnectionsPane from './ConnectionsPane';

export default function Connections() {
    // const [selectedConnection, setSelectedConnection] = React.useState<ChatProps>(chats[0]);
    return (
        <Sheet
            sx={{
                flex: 1,
                width: '100%',
                mx: 'auto',
                pt: { xs: 'var(--Header-height)', md: 0 },
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'minmax(min-content, min(30%, 400px)) 1fr',
                },
            }}
        >
            <Sheet
                sx={{
                    position: { xs: 'fixed', sm: 'sticky' },
                    transform: {
                        xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
                        sm: 'none',
                    },
                    transition: 'transform 0.4s, width 0.4s',
                    zIndex: 100,
                    width: '100%',
                    top: 52,
                }}
            >
                <ConnectionsPane />
                {/* TODO */}
                {/* <ChatsPane
                    chats={chats}
                    selectedChatId={selectedConnection.id}
                    setSelectedChat={setSelectedConnection}
                /> */}
            </Sheet>
            {/* <MessagesPane chat={selectedConnection} /> */}
        </Sheet>
    );
}
