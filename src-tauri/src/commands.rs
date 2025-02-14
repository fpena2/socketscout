use futures::{stream::SplitStream, StreamExt};
use serde::Serialize;
use tauri::{AppHandle, Emitter, State};
use tokio_tungstenite::{connect_async, tungstenite, WebSocketStream};
use uuid::Uuid;

use crate::{connections, database, events};

type SplitWssStream =
    SplitStream<WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>>;

#[tauri::command]
pub async fn establish_connection(
    app: AppHandle,
    con: State<'_, connections::Store>,
    db: State<'_, database::Store>,
    address: &str,
) -> Result<(), String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;

    log::info!("Connected to server: {}", address);

    let address = address.to_string();
    let (write, read) = ws_stream.split();

    // Store connection in state so that we can send messages to it later.
    let uuid = Uuid::new_v4();
    {
        con.inner()
            .add_connection(uuid, (address.clone(), write))
            .await
            .map_err(|e| e.to_string())?;
    }

    // Open a new chat
    {
        db.inner()
            .add_chat(uuid, database::Chat::new(uuid, address.clone()))
            .await
            .map_err(|e| e.to_string())?;
    }

    // Notify the front-end that the chat has been stated
    {
        let chats = con.inner().get_connections_ids().await;
        app.emit(
            "all-chats-event",
            events::EventsFromServer::AllChats { chats: chats },
        )
        .unwrap();
    }

    // Collect messages from server
    tokio::spawn(receive_server_message(
        uuid,
        address,
        read,
        db.inner().clone(),
    ));

    Ok(())
}

async fn receive_server_message(
    uuid: Uuid,
    address: String,
    mut read: SplitWssStream,
    db: database::Store,
) {
    while let Some(message) = read.next().await {
        match message {
            Ok(msg) => {
                log::info!("Received: {:?}", msg);
                if let tungstenite::Message::Text(content) = msg {
                    {
                        let mut chat = match db.get(uuid).await {
                            Some(chat) => chat,
                            None => {
                                log::error!("Chat not found for uuid: {}", uuid);
                                break;
                            }
                        };

                        let message = database::Message::new(
                            address.to_string(),
                            "You".to_string(),
                            content.to_string(),
                            chrono::Utc::now(),
                        );

                        chat.add_message(message);
                    }
                }
            }
            Err(e) => {
                log::info!("Error while receiving message: {:?}", e);
                break;
            }
        }
    }
}
