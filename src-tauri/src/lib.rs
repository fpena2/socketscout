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
            commands::establish_connection,
            commands::get_list_of_chats,
            commands::get_chat_messages,
            commands::close_connection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
