type UserProps = {
  name: string;
  username: string;
  online: boolean;
};

type MessageProps = {
  id: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: UserProps | 'You';
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};

type ChatProps = {
  id: string;
  sender: UserProps;
  messages: MessageProps[];
};

type ChatBubbleProps = MessageProps & {
  variant: 'sent' | 'received';
};

type ActiveChats = {
  names: string[];
};

type ServerEvent =
  | {
    event: 'connected';
    data: {
      name: string;
    };
  }
  | {
    event: 'disconnected';
    data: {
      name: string;
    };
  }
  | {
    event: 'message';
    data: {
      name: string;
      message: string;
      received_at: string;
    };
  };

export type {
  ServerEvent,
  UserProps,
  MessageProps,
  ChatProps,
  ChatBubbleProps,
  ActiveChats,
};
