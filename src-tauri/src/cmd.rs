use crate::actors::state::{AppState, InsertConnection, SendMessage};
use chrono::{DateTime, Utc};
use futures::StreamExt;
use kameo::actor::ActorRef;
use serde::Serialize;
use tauri::{ipc::Channel, AppHandle, Emitter, State};
use tokio_tungstenite::{connect_async, tungstenite};

type SharedState = ActorRef<AppState>;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum ServerEvent {
    #[serde(rename_all = "camelCase")]
    Connected { name: String },
    #[serde(rename_all = "camelCase")]
    Disconnected { name: String },
    #[serde(rename_all = "camelCase")]
    Message {
        name: String,
        message: String,
        received_at: DateTime<Utc>,
    },
}

#[tauri::command]
pub async fn send_message(
    state: State<'_, SharedState>,
    address: String,
    message: String,
) -> Result<(), String> {
    state
        .tell(SendMessage {
            address,
            content: message,
        })
        .await
        .unwrap();
    Ok(())
}

#[tauri::command]
pub async fn establish_connection(
    state: State<'_, SharedState>,
    address: &str,
    on_event: Channel<ServerEvent>,
) -> Result<(), String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;
    log::info!("Connected to server: {}", address);

    let address = address.to_string();
    let (write, read) = ws_stream.split();

    // Tell the frontend that the connection was successful.
    // Store connection in state so that we can send messages to it later.
    on_event
        .send(ServerEvent::Connected {
            name: address.clone(),
        })
        .unwrap();
    state
        .tell(InsertConnection {
            address: address.clone(),
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
                        on_event
                            .send(ServerEvent::Message {
                                name: address.clone(),
                                message: content.to_string(),
                                received_at: DateTime::from(Utc::now()),
                            })
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
