use futures::stream::SplitSink;
use futures::SinkExt;
use kameo::message::{Context, Message};
use kameo::Actor;
use std::collections::HashMap;
use tokio_tungstenite::tungstenite;
use tokio_tungstenite::WebSocketStream;
type SinkWssStream = SplitSink<
    WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    tungstenite::Message,
>;

#[derive(Actor, Default)]
pub struct Counter {
    pub connections: HashMap<String, SinkWssStream>,
}

pub struct GetConnections;

pub struct InsertConnection {
    pub address: String,
    pub connection: SinkWssStream,
}

pub struct SendMessage {
    pub address: String,
    pub content: String,
}

impl Message<GetConnections> for Counter {
    type Reply = Vec<String>;

    async fn handle(
        &mut self,
        _msg: GetConnections,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        self.connections.keys().cloned().collect()
    }
}

impl Message<InsertConnection> for Counter {
    type Reply = usize;

    async fn handle(
        &mut self,
        msg: InsertConnection,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        self.connections.insert(msg.address, msg.connection);
        self.connections.keys().count()
    }
}
impl Message<SendMessage> for Counter {
    type Reply = Result<(), String>;

    async fn handle(
        &mut self,
        msg: SendMessage,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        match self.connections.get_mut(&msg.address) {
            Some(connection) => {
                let message = tungstenite::Message::Text(msg.content.into());
                connection.send(message).await.map_err(|e| e.to_string())
            }
            None => return Err(format!("No connection found for address: {}", msg.address)),
        }
    }
}
