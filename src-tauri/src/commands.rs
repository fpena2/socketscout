use futures::{stream::SplitStream, StreamExt};
use tauri::{AppHandle, Emitter, State};
use tokio_tungstenite::{connect_async, tungstenite, WebSocketStream};
use uuid::Uuid;

use crate::{
    connections, database,
    events::{self, ConversationCmdType},
};

type SplitWssStream =
    SplitStream<WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>>;

#[tauri::command]
pub async fn cmd_get_conversations_list(
    con: State<'_, connections::Store>,
) -> Result<Vec<ConversationCmdType>, String> {
    let chats = con.inner().get_connections_ids().await;
    Ok(chats)
}

#[tauri::command]
pub async fn cmd_get_chat_messages(
    app: AppHandle,
    db: State<'_, database::Store>,
    uudi: String,
) -> Result<(), String> {
    let uuid: Uuid = Uuid::parse_str(&uudi).unwrap();
    match db.get_messages(uuid).await {
        Some(messages) => {
            app.emit(
                "chat-messages-event",
                events::EventsFromServer::ChatMessages { messages },
            )
            .unwrap();
        }
        None => {
            log::error!("Chat not found for uuid: {}", uuid);
        }
    };
    Ok(())
}

#[tauri::command]
pub async fn cmd_send_message(
    db: State<'_, database::Store>,
    uuid: &str,
    message: &str,
) -> Result<(), String> {
    let uuid = Uuid::parse_str(uuid).unwrap();
    let message: events::MessageCmdType = serde_json::from_str(&message).unwrap();
    db.inner().add_message(uuid, message).await;
    Ok(())
}

#[tauri::command]
pub async fn cmd_close_connection(
    con: State<'_, connections::Store>,
    uuid: &str,
) -> Result<(), String> {
    con.inner()
        .close_connection(Uuid::parse_str(uuid).unwrap())
        .await;
    Ok(())
}

#[tauri::command]
pub async fn cmd_establish_connection(
    app: AppHandle,
    con: State<'_, connections::Store>,
    db: State<'_, database::Store>,
    address: &str,
) -> Result<String, String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;

    log::info!("Connected to server: {}", address);

    let (write, read) = ws_stream.split();

    // Store connection in state so that we can send messages to it later.
    let uuid = Uuid::new_v4();
    let address = address.to_string();
    {
        con.inner().add_connection(uuid, (address, write)).await;
    }

    // Open a new chat
    {
        db.inner().start_chat(uuid).await;
    }

    // FIXME: listen after the chat is opened by the user
    // Collect messages from server
    tokio::spawn(receive_server_message(app, uuid, read, db.inner().clone()));

    Ok(uuid.to_string())
}

async fn receive_server_message(
    app: AppHandle,
    uuid: Uuid,
    mut read: SplitWssStream,
    db: database::Store,
) {
    while let Some(message) = read.next().await {
        match message {
            Ok(msg) => {
                log::info!("Received: {:?}", msg);
                if let tungstenite::Message::Text(content) = msg {
                    {
                        let message = events::MessageCmdType::new(
                            uuid,
                            content.to_string(),
                            false,
                            chrono::Utc::now(),
                        );

                        db.add_message(uuid, message.clone()).await;
                        app.emit(
                            "chat-message-event",
                            events::EventsFromServer::ChatMessage { message },
                        )
                        .unwrap();
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
