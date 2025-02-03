import { invoke } from "@tauri-apps/api/core";

async function new_connection(address: string) {
    const result = await invoke("new_connection", { address: address });
    return result;
}
