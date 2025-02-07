mod actors;
mod cmd;

use actors::state::AppState;
use cmd::{active_connections, establish_connection, send_message};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    // TODO: upgrade to ActorPool
    let actor_ref = kameo::spawn(AppState::default());

    // Start Tauri task
    tauri::Builder::default()
        .manage(actor_ref)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            active_connections,
            establish_connection,
            send_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
