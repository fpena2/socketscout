use crate::state::{Counter, GetConnections, InsertConnection, SendMessage};
use futures::StreamExt;
use kameo::actor::ActorRef;
use tauri::State;
use tokio_tungstenite::connect_async;

type SharedState = ActorRef<Counter>;

#[tauri::command]
pub async fn active_connections(state: State<'_, SharedState>) -> Result<Vec<String>, String> {
    let connections = state.ask(GetConnections).await.unwrap();
    Ok(connections)
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
) -> Result<(), String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;

    let (write, read) = ws_stream.split();
    state
        .tell(InsertConnection {
            address: address.to_string(),
            connection: write,
        })
        .await
        .unwrap();

    tokio::spawn(async move {
        let mut read = read;
        while let Some(message) = read.next().await {
            match message {
                Ok(msg) => {
                    println!("Received: {:?}", msg);
                }
                Err(e) => {
                    eprintln!("Error while receiving message: {:?}", e);
                    break;
                }
            }
        }
    });

    Ok(())
}
