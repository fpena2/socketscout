import { invoke } from '@tauri-apps/api/core';

export async function establish_connection(url: URL): Promise<any> {
  try {
    let address = url.toString();
    const result = await invoke('cmd_establish_connection', { address });
    return result;
  } catch (error) {
    console.error('Error fetching active connections:', error);
    throw error;
  }
}
