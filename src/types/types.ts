type MessageCmdType = {
  uuid: string;
  // sender: string;
  // receiver: string;
  content: string;
  timestamp: string;
  sent_by_client: boolean;
};

type ConversationCmdType = {
  uuid: string;
  peer: string; // server's address
  online: boolean;
  avatar: string; // FIXME: gen an avatar like github's
};

// type ConversationsCmdType = {
//   conversations: ConversationCmdType[];
// };

// type MessagesCmdType = {
//   messages: MessageCmdType[];
// };

export type { ConversationCmdType, MessageCmdType };
