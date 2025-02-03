// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main]
async fn main() {
    // share the current runtime with Tauri
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    socketscout_lib::run().await;
}
