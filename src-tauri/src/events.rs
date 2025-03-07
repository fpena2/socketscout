use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Serialize)]
pub struct ConversationCmdType {
    uuid: String, // uuid::Uuid,
    peer: String,
    online: bool,
    avatar: String,
}

impl ConversationCmdType {
    pub fn new(uuid: uuid::Uuid, peer: String) -> Self {
        ConversationCmdType {
            uuid: uuid.to_string(),
            peer,
            online: true,
            avatar: String::new(),
        }
    }
}

/// A message sent from the server to the user or vise versa.
/// The fields of this struct must be simple types so that it can be serialized by Tauri.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct MessageCmdType {
    uuid: String, // uuid::Uuid,
    content: String,
    sent_by_client: bool,
    timestamp: String, // chrono::DateTime<chrono::Utc>,
}

impl MessageCmdType {
    pub fn new(
        uuid: uuid::Uuid,
        content: String,
        sent_by_client: bool,
        timestamp: chrono::DateTime<chrono::Utc>,
    ) -> Self {
        MessageCmdType {
            uuid: uuid.to_string(),
            content,
            sent_by_client,
            timestamp: timestamp.to_string(),
        }
    }

    pub fn from_partial(partial_message: MessageCmdType) -> Self {
        let uuid = Uuid::new_v4();
        let content = partial_message.content;
        let sent_by_client = partial_message.sent_by_client;
        let timestamp = chrono::Utc::now();
        MessageCmdType::new(uuid, content, sent_by_client, timestamp)
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum EventsFromServer {
    #[serde(rename_all = "camelCase")]
    AllChats { chats: Vec<ConversationCmdType> },
    #[serde(rename_all = "camelCase")]
    ChatMessages { messages: Vec<MessageCmdType> },
    #[serde(rename_all = "camelCase")]
    ChatMessage { message: MessageCmdType },
}
