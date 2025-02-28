use log::LevelFilter;
use tauri_plugin_log::{Target, TargetKind};

mod commands;
mod connections;
mod database;
mod events;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let state = connections::Store::default();
    let db = database::Store::new();

    // Start Tauri task
    tauri::Builder::default()
        .manage(state)
        .manage(db)
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([Target::new(TargetKind::Stdout)])
                .level(LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            commands::cmd_establish_connection,
            commands::cmd_close_connection,
            commands::cmd_send_message,
            commands::cmd_get_list_of_chats,
            commands::cmd_get_chat_messages,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
