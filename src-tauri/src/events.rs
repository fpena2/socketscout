use serde::Serialize;

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

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum EventsFromServer {
    #[serde(rename_all = "camelCase")]
    AllChats { chats: Vec<ChatResponse> },
}
