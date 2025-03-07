use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::events;

#[derive(Debug, Default, Clone)]
pub struct Store {
    db: Arc<RwLock<HashMap<Uuid, Vec<events::MessageCmdType>>>>,
}

impl Store {
    pub fn new() -> Self {
        Store {
            db: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    pub async fn start_chat(&self, key: Uuid) {
        let mut db = self.db.write().await;
        db.insert(key, Vec::new());
    }

    pub async fn add_message(&self, key: Uuid, message: events::MessageCmdType) {
        let mut db = self.db.write().await;
        if let Some(convo) = db.get_mut(&key) {
            convo.push(message);
        }
    }

    pub async fn get_messages(&self, key: Uuid) -> Option<Vec<events::MessageCmdType>> {
        let db = self.db.read().await;
        db.get(&key).cloned()
    }
}
