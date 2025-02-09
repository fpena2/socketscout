use chrono::{DateTime, Utc};
use futures::stream::SplitSink;
use futures::SinkExt;
use kameo::message::{Context, Message};
use kameo::Actor;
use serde::Serialize;
use std::collections::HashMap;
use tokio_tungstenite::tungstenite;
use tokio_tungstenite::WebSocketStream;

type SinkWssStream = SplitSink<
    WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
    tungstenite::Message,
>;

#[derive(Debug, Serialize)]
pub struct MMessage {
    pub content: String,
    pub received_at: DateTime<Utc>,
}

#[derive(Actor, Default)]
#[derive(Serialize)]
pub struct AppState {
    #[serde(skip_serializing)]
    pub connections: HashMap<String, SinkWssStream>,
    pub conversations: HashMap<String, Vec<MMessage>>,
}

pub struct GetConnections;

pub struct GetConversations;

pub struct InsertConnection {
    pub address: String,
    pub connection: SinkWssStream,
}

pub struct SendMessage {
    pub address: String,
    pub content: String,
}

pub struct StoreMessage {
    pub address: String,
    pub message: MMessage,
}

impl Message<GetConnections> for AppState {
    type Reply = Vec<String>;

    async fn handle(
        &mut self,
        _msg: GetConnections,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        self.connections.keys().cloned().collect()
    }
}

impl Message<GetConversations> for AppState {
    type Reply = Result<String, String>;

    async fn handle(
        &mut self,
        _msg: GetConversations,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        serde_json::to_string(&self.conversations).map_err(|e| e.to_string())
    }
}

impl Message<InsertConnection> for AppState {
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
impl Message<SendMessage> for AppState {
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

impl Message<StoreMessage> for AppState {
    type Reply = Result<(), String>;

    async fn handle(
        &mut self,
        msg: StoreMessage,
        _ctx: Context<'_, Self, Self::Reply>,
    ) -> Self::Reply {
        let conversation = self
            .conversations
            .entry(msg.address)
            .or_insert_with(Vec::new);
        conversation.push(msg.message);
        Ok(())
    }
}
