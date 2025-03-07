use std::time::Duration;

use futures::{stream::SplitStream, StreamExt};
use log::info;
use tauri::{AppHandle, Emitter, State};
use tokio::time::interval;
use tokio_tungstenite::{connect_async, tungstenite, WebSocketStream};
use uuid::Uuid;

use crate::{
    connections, database,
    events::{self, ConversationCmdType},
};

type SplitWssStream =
    SplitStream<WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>>;

#[tauri::command]
pub async fn set_active_conversation(
    con: State<'_, connections::Store>,
    uuid: &str,
) -> Result<(), String> {
    info!("Setting active conversation to {}", uuid);
    con.inner()
        .set_active_conversation(Uuid::parse_str(uuid).unwrap())
        .await;
    Ok(())
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
    con.inner()
        .close_conversation(Uuid::parse_str(uuid).unwrap())
        .await;
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
                            app.emit("new_messages", &message_buffer)
                                .expect("Failed to emit new_messages event");
                        }
                    }
                    message_buffer.clear();
                }
            }

            message = read.next() => {
                if let Some(Ok(tungstenite::Message::Text(content))) = message {
                    let message = events::MessageCmdType::new(
                        uuid,
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
