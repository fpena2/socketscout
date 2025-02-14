type ChatMessage = {
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

type Chat = {
  uuid: string;
  server_address: string;
  messages: ChatMessage[];
};

//
// Server Side Events
//
type ServerChatsEvent = {
  chats: Chat[];
};

export type {
  Chat,
  ServerChatsEvent,
  ChatMessage,
};
