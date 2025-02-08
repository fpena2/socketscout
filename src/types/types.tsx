type UserProps = {
  name: string;
  username: string;
  avatar: string;
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

type MessagesPaneProps = {
  chat: ChatProps;
};

type ChatBubbleProps = MessageProps & {
  variant: 'sent' | 'received';
};

export type {
  UserProps,
  MessageProps,
  ChatProps,
  MessagesPaneProps,
  ChatBubbleProps,
};
