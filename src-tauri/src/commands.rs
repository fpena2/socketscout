use std::time::Duration;

use futures::{stream::SplitStream, StreamExt};
use log::info;
use tauri::{AppHandle, Emitter, State};
use tokio::time::interval;
use tokio_tungstenite::{connect_async, tungstenite, WebSocketStream};
use uuid::Uuid;

use crate::{
    connections, database,
    events::{self, ConversationCmdType, MessageCmdType},
};

type SplitWssStream =
    SplitStream<WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>>;

#[tauri::command]
pub async fn cmd_set_active_conversation(
    con: State<'_, connections::Store>,
    uuid: &str,
) -> Result<(), String> {
    info!("Setting active conversation to {}", uuid);
    let uuid = Uuid::parse_str(uuid).map_err(|e| format!("Invalid UUID: {}", e))?;
    con.inner().set_active_conversation(uuid).await;
    Ok(())
}

#[tauri::command]
pub async fn cmd_get_conversation_messages(
    db: State<'_, database::Store>,
    uuid: &str,
) -> Result<Vec<MessageCmdType>, String> {
    let uuid = Uuid::parse_str(uuid).map_err(|e| format!("Invalid UUID: {}", e))?;
    match db.get_messages(uuid).await {
        Some(messages) => Ok(messages),
        None => Ok(Vec::new()),
    }
}

#[tauri::command]
pub async fn cmd_get_conversations(
    con: State<'_, connections::Store>,
) -> Result<Vec<ConversationCmdType>, String> {
    let convos = con.inner().get_conversations().await;
    Ok(convos)
}

#[tauri::command]
pub async fn cmd_close_conversation(
    con: State<'_, connections::Store>,
    uuid: &str,
) -> Result<(), String> {
    let uuid = Uuid::parse_str(uuid).map_err(|e| format!("Invalid UUID: {}", e))?;
    con.inner().close_conversation(uuid).await;
    Ok(())
}

#[tauri::command]
pub async fn cmd_open_conversation(
    app: AppHandle,
    con: State<'_, connections::Store>,
    db: State<'_, database::Store>,
    address: &str,
) -> Result<ConversationCmdType, String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;

    log::info!("Connected to server: {}", address);

    let (write, read) = ws_stream.split();

    // Store connection in state so that we can send messages to it later.
    let uuid = Uuid::new_v4();
    let address = address.to_string();
    {
        con.inner().add_conversation(uuid, (address, write)).await;
    }

    // Open a new chat
    {
        db.inner().start_chat(uuid).await;
    }

    // FIXME: listen after the chat is opened by the user
    // Collect messages from server
    tokio::spawn(receive_server_message(
        app,
        uuid,
        read,
        db.inner().clone(),
        con.inner().clone(),
    ));

    let convo = con
        .inner()
        .get_conversation(uuid)
        .await
        .expect("Conversation not found");
    Ok(convo)
}

async fn receive_server_message(
    app: AppHandle,
    uuid: Uuid,
    mut read: SplitWssStream,
    db: database::Store,
    con: connections::Store,
) {
    let mut message_buffer = Vec::new();
    let mut interval = interval(Duration::from_millis(500));
    loop {
        tokio::select! {
            _ = interval.tick() => {
                if !message_buffer.is_empty() {
                    if let Some(active_convo_id) = con.get_active_conversation().await{
                        if active_convo_id == uuid {
                            app.emit("event_new_messages", &message_buffer)
                                .expect("Failed to emit event for new messages");
                        }
                    }
                    message_buffer.clear();
                }
            }

            message = read.next() => {
                if let Some(Ok(tungstenite::Message::Text(content))) = message {
                    let message = events::MessageCmdType::new(
                        Uuid::new_v4(),
                        content.to_string(),
                        false,
                        chrono::Utc::now(),
                    );

                    message_buffer.push(message.clone());

                    //  Save to the database
                    db.add_message(uuid, message).await;
                }
            }
        }
    }
}

////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////

#[tauri::command]
pub async fn cmd_send_message(
    db: State<'_, database::Store>,
    uuid: &str,
    message: &str,
) -> Result<(), String> {
    let uuid = Uuid::parse_str(uuid).map_err(|e| format!("Invalid UUID: {}", e))?;
    let message: events::MessageCmdType =
        serde_json::from_str(&message).map_err(|e| format!("Invalid message or format: {}", e))?;
    db.inner().add_message(uuid, message).await;
    Ok(())
}
