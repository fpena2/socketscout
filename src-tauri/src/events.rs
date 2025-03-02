use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct ConversationCmdType {
    uuid: uuid::Uuid,
    peer: String,
    online: bool,
    avatar: String,
}

impl ConversationCmdType {
    pub fn new(uuid: uuid::Uuid, peer: String) -> Self {
        ConversationCmdType {
            uuid,
            peer,
            online: true,
            avatar: String::new(),
        }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct MessageCmdType {
    uuid: uuid::Uuid,
    content: String,
    sent_by_client: bool,
    timestamp: chrono::DateTime<chrono::Utc>,
}

impl MessageCmdType {
    pub fn new(
        uuid: uuid::Uuid,
        content: String,
        sent_by_client: bool,
        timestamp: chrono::DateTime<chrono::Utc>,
    ) -> Self {
        MessageCmdType {
            uuid,
            content,
            sent_by_client,
            timestamp,
        }
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
