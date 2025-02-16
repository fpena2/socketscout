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
    connections: Arc<RwLock<HashMap<uuid::Uuid, (String, SinkWssStream)>>>,
}

impl Default for Store {
    fn default() -> Self {
        Store {
            connections: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

impl Store {
    pub async fn add_connection(&self, id: uuid::Uuid, connection: (String, SinkWssStream)) {
        let mut connections = self.connections.write().await;
        connections.insert(id, connection);
    }

    pub async fn get_connections_ids(&self) -> Vec<events::ChatResponse> {
        let connections = self.connections.read().await;
        connections
            .iter()
            .map(|(id, (address, _))| events::ChatResponse::new(id.clone(), address.clone()))
            .collect()
    }

    pub async fn close_connection(&self, id: uuid::Uuid) {
        let mut connections = self.connections.write().await;
        if let Some((addr, sink)) = connections.get_mut(&id) {
            let _ = sink.send(tungstenite::Message::Close(None)).await;
            log::info!("Closing connection with server: {addr} (ID: {id})");
        }
        connections.remove(&id);
    }
}
