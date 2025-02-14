use serde::Serialize;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Debug, Default, Clone, Serialize)]
pub struct Message {
    sender: String,
    recipient: String,
    content: String,
    timestamp: chrono::DateTime<chrono::Utc>,
}
impl Message {
    pub fn new(
        sender: String,
        receiver: String,
        content: String,
        timestamp: chrono::DateTime<chrono::Utc>,
    ) -> Self {
        Message {
            sender,
            recipient: receiver,
            content,
            timestamp,
        }
    }
}

#[derive(Debug, Default, Clone, Serialize)]
pub struct Chat {
    uuid: Uuid,
    server_address: String,
    messages: Vec<Message>,
}
impl Chat {
    pub fn new(uuid: uuid::Uuid, server_address: String) -> Self {
        Chat {
            uuid,
            server_address,
            messages: Vec::new(),
        }
    }
    pub fn add_message(&mut self, message: Message) {
        self.messages.push(message);
    }
}

#[derive(Debug, Default, Clone)]
pub struct Store {
    chats_db: Arc<RwLock<HashMap<Uuid, Chat>>>,
}

impl Store {
    pub fn new() -> Self {
        Store {
            chats_db: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    pub async fn add_chat(&self, key: Uuid, chat: Chat) -> anyhow::Result<()> {
        let mut db = self.chats_db.write().await;
        db.insert(key, chat);
        Ok(())
    }
    pub async fn get(&self, key: Uuid) -> Option<Chat> {
        let db = self.chats_db.read().await;
        db.get(&key).cloned()
    }
}
