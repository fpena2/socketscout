use futures::stream::SplitSink;
use futures::SinkExt;
use futures::StreamExt;
use std::collections::{HashMap, HashSet};
use std::sync::Arc;
use tauri::{Manager, State};
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{stream::MaybeTlsStream, Message},
    WebSocketStream,
};

type SinkWssStream =
    SplitSink<WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>, Message>;
type ArcSinkWssStream = Arc<Mutex<SinkWssStream>>;

//
#[derive(Default)]
struct AppState {
    pub connections: HashMap<String, ArcSinkWssStream>,
}

type SharedState = Arc<Mutex<AppState>>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let state = Arc::new(Mutex::new(AppState::default()));
    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            active_connections,
            establish_connection,
            send_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(rename_all = "snake_case")]
async fn active_connections(state: State<'_, SharedState>) -> Result<usize, String> {
    let state = state.lock().await;
    Ok(state.connections.keys().count())
}

#[tauri::command(rename_all = "snake_case")]
async fn send_message(
    state: State<'_, SharedState>,
    address: &str,
    message: String,
) -> Result<(), String> {
    let write = {
        let state = state.lock().await;
        match state.connections.get(address) {
            Some(connection) => connection.clone(),
            None => return Err(format!("No connection found for address: {}", address)),
        }
    };

    let mut write = write.lock().await;
    write
        .send(Message::Text(message.into()))
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
async fn establish_connection(state: State<'_, SharedState>, address: &str) -> Result<(), String> {
    let (ws_stream, _) = connect_async(address)
        .await
        .map_err(|_| "Failed to connect with server")?;

    let (mut write, read) = ws_stream.split();

    {
        let mut state = state.lock().await;
        state
            .connections
            .insert(address.to_string(), Arc::new(Mutex::new(write)));
    }

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
