type ChatMessage = {
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

export type { Chat, AllChatsEvent as ServerChatsEvent, ChatMessage };
