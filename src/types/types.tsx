type ChatMessage = {
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
};

type Chat = {
  uuid: string;
  address: string;
  messages: ChatMessage[];
};

//
// Server Side Events
//
type ServerEventConnected = {
  chat: Chat;
};
type ServerEventDisconnected = {
  name: string;
};
type ServerEventMessage = {
  name: string;
  message: string;
  received_at: string;
};

export type {
  Chat,
  // Server Events
  ServerEventMessage,
  ServerEventDisconnected,
  ServerEventConnected,
  // User Events
  ChatMessage,
};
