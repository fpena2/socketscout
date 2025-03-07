use futures::stream::SplitSink;
use futures::SinkExt;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tokio_tungstenite::tungstenite;
use tokio_tungstenite::WebSocketStream;

type SinkWssStream = SplitSink<
    WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    tungstenite::Message,
>;

use crate::events;

pub struct Store {
    current_conversation: Arc<RwLock<Option<uuid::Uuid>>>,
    conversations: Arc<RwLock<HashMap<uuid::Uuid, (String, SinkWssStream)>>>,
}

impl Default for Store {
    fn default() -> Self {
        Store {
            current_conversation: Arc::new(RwLock::new(None)),
            conversations: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

impl Store {
    pub async fn set_active_conversation(&self, id: uuid::Uuid) {
        let mut current_conversation = self.current_conversation.write().await;
        *current_conversation = Some(id);
    }

    pub async fn add_conversation(&self, id: uuid::Uuid, conversation: (String, SinkWssStream)) {
        let mut conversations = self.conversations.write().await;
        conversations.insert(id, conversation);
    }

    pub async fn get_conversation(&self, id: uuid::Uuid) -> Option<events::ConversationCmdType> {
        let conversations = self.conversations.read().await;
        conversations
            .get(&id)
            .map(|(address, _)| events::ConversationCmdType::new(id, address.clone()))
    }

    pub async fn get_conversations(&self) -> Vec<events::ConversationCmdType> {
        let conversations = self.conversations.read().await;
        let futures = conversations
            .iter()
            .map(|(id, _)| self.get_conversation(id.clone()));

        let results: Vec<Option<events::ConversationCmdType>> =
            futures::future::join_all(futures).await;

        results.into_iter().filter_map(|x| x).collect()
    }

    pub async fn close_conversation(&self, id: uuid::Uuid) {
        let mut conversations = self.conversations.write().await;
        if let Some((addr, sink)) = conversations.get_mut(&id) {
            let _ = sink.send(tungstenite::Message::Close(None)).await;
            log::info!("Closing conversation with server: {addr} (ID: {id})");
        }
        conversations.remove(&id);
    }
}
