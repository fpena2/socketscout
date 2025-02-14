type ChatMessage = {
  chat_uuid: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

type Chat = {
  uuid: string;
  address: string;
};

//
// Server Side Events
//
type AllChatsEvent = {
  chats: Chat[];
};

type ChatMessagesEvent = {
  messages: ChatMessage[];
};

type ChatMessageEvent = {
  message: ChatMessage;
};

export type { Chat, AllChatsEvent, ChatMessageEvent, ChatMessage };
