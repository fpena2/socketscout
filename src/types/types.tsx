type ChatMessage = {
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
};

type Chat = {
  address: string;
  messages: ChatMessage[];
};

type ServerEventConnected = {
  name: Chat;
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
  // Events
  ServerEventMessage,
  ServerEventDisconnected,
  ServerEventConnected,
  //
  Chat,
  ChatMessage,
};
