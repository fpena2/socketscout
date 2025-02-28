use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct ChatResponse {
    uuid: uuid::Uuid,
    address: String,
}

impl ChatResponse {
    pub fn new(uuid: uuid::Uuid, address: String) -> Self {
        ChatResponse { uuid, address }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct MessagesResponse {
    chat_uuid: uuid::Uuid,
    sender: String,
    recipient: String,
    content: String,
    timestamp: chrono::DateTime<chrono::Utc>,
}

impl MessagesResponse {
    pub fn new(
        chat_uuid: uuid::Uuid,
        sender: String,
        receiver: String,
        content: String,
        timestamp: chrono::DateTime<chrono::Utc>,
    ) -> Self {
        MessagesResponse {
            chat_uuid,
            sender,
            recipient: receiver,
            content,
            timestamp,
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum EventsFromServer {
    #[serde(rename_all = "camelCase")]
    AllChats { chats: Vec<ChatResponse> },
    #[serde(rename_all = "camelCase")]
    ChatMessages { messages: Vec<MessagesResponse> },
    #[serde(rename_all = "camelCase")]
    ChatMessage { message: MessagesResponse },
}
