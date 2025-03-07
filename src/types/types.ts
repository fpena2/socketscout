type MessageCmdType = {
  uuid: string; // unique identifier for a message
  // sender: string;
  // receiver: string;
  content: string;
  timestamp: string;
  sent_by_client: boolean;
};

type ConversationCmdType = {
  uuid: string; // unique identifier for a conversation
  peer: string; // server's address
  online: boolean;
  avatar: string; // FIXME: gen an avatar like github's
};

export type { ConversationCmdType, MessageCmdType };
