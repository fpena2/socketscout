use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::events;

#[derive(Debug, Default, Clone)]
pub struct Store {
    chats_db: Arc<RwLock<HashMap<Uuid, Vec<events::MessageCmdType>>>>,
}

impl Store {
    pub fn new() -> Self {
        Store {
            chats_db: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    pub async fn start_chat(&self, key: Uuid) {
        let mut db = self.chats_db.write().await;
        db.insert(key, Vec::new());
    }

    pub async fn add_message(&self, key: Uuid, message: events::MessageCmdType) {
        let mut db = self.chats_db.write().await;
        if let Some(chat) = db.get_mut(&key) {
            chat.push(message);
        }
    }

    pub async fn get_messages(&self, key: Uuid) -> Option<Vec<events::MessageCmdType>> {
        let db = self.chats_db.read().await;
        db.get(&key).cloned()
    }
}
