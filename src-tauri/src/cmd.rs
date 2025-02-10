use crate::actors::state::{AppState, InsertConnection};
use chrono::{DateTime, Utc};
use futures::StreamExt;
use kameo::actor::ActorRef;
use serde::Serialize;
use tauri::{AppHandle, Emitter, State};
use tokio_tungstenite::{connect_async, tungstenite};
use uuid::Uuid;

type SharedState = ActorRef<AppState>;

#[derive(Debug, Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatMessage {
    sender: String,
    sender_avatar: Option<String>,
    content: String,
    timestamp: String,
}

impl ChatMessage {
    fn new(sender: String) -> Self {
        ChatMessage {
            sender,
            sender_avatar: None,
            content: String::new(),
            timestamp: Utc::now().to_rfc3339(),
        }
    }
}

#[derive(Debug, Default, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Chat {
    uuid: Uuid,
    address: String,
    messages: Vec<ChatMessage>,
}

impl Chat {
    fn new(address: String, uuid: Uuid) -> Self {
        Chat {
            address,
            uuid,
            messages: Vec::new(),
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum ServerEvent {
    #[serde(rename_all = "camelCase")]
    Connected { name: Chat },
    #[serde(rename_all = "camelCase")]
    Disconnected { name: String },
    #[serde(rename_all = "camelCase")]
    Message {
        name: String,
        message: String,
        received_at: DateTime<Utc>,
    },
}

// #[tauri::command]
// pub async fn send_message(
//     state: State<'_, SharedState>,
//     address: String,
//     message: String,
// ) -> Result<(), String> {
//     state
//         .tell(SendMessage {
//             address,
//             content: message,
//         })
//         .await
//         .unwrap();
//     Ok(())
// }

#[tauri::command]
pub async fn establish_connection(
    app: AppHandle,
    state: State<'_, SharedState>,
    address: &str,
) -> Result<(), String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;
    log::info!("Connected to server: {}", address);

    let address = address.to_string();
    let (write, read) = ws_stream.split();

    // Tell the frontend that the connection was successful.
    // Store connection in state so that we can send messages to it later.
    let id = Uuid::new_v4();
    app.emit(
        "server-connected",
        ServerEvent::Connected {
            name: Chat::new(address.clone(), id),
        },
    )
    .unwrap();

    state
        .tell(InsertConnection {
            address: address.clone(),
            id,
            connection: write,
        })
        .await
        .unwrap();

    tokio::spawn(async move {
        let mut read = read;
        while let Some(message) = read.next().await {
            match message {
                Ok(msg) => {
                    log::info!("Received: {:?}", msg);
                    if let tungstenite::Message::Text(content) = msg {
                        app.emit(
                            "server-event-message",
                            ServerEvent::Message {
                                name: address.clone(),
                                message: content.to_string(),
                                received_at: DateTime::from(Utc::now()),
                            },
                        )
                        .unwrap();
                    }
                }
                Err(e) => {
                    log::info!("Error while receiving message: {:?}", e);
                    break;
                }
            }
        }
    });

    Ok(())
}
