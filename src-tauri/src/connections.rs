use futures::stream::SplitSink;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tokio_tungstenite::tungstenite;
use tokio_tungstenite::WebSocketStream;

type SinkWssStream = SplitSink<
    WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    tungstenite::Message,
>;

pub struct Store {
    connections: Arc<RwLock<HashMap<uuid::Uuid, SinkWssStream>>>,
}

impl Default for Store {
    fn default() -> Self {
        Store {
            connections: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

impl Store {
    pub async fn add_connection(
        &self,
        id: uuid::Uuid,
        connection: SinkWssStream,
    ) -> anyhow::Result<()> {
        let mut connections = self.connections.write().await;
        connections.insert(id, connection);
        Ok(())
    }
}
