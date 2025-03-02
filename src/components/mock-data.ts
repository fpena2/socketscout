import { ConversationCmdType, MessageCmdType } from '@/types';

export const conversations: ConversationCmdType[] = [
  {
    uuid: '1',
    peer: 'John Doe',
    avatar: 'images.unsplash.com/photo-1599566150163-29194dcaad36',
    online: true,
  },
  {
    uuid: '2',
    peer: 'Jane Smith',
    avatar: 'images.unsplash.com/photo-1494790108377-be9c29b29330',
    online: false,
  },
];

export const messages: MessageCmdType[] = [
  {
    uuid: '1',
    text: 'Hi there!',
    receiver: 'peer1',
    sender: 'peer2',
    timestamp: '10:00 AM',
    sent_by_client: true,
  },
  {
    uuid: '2',
    text: 'Hello! How are you?',
    receiver: 'peer1',
    sender: 'peer2',
    timestamp: '10:02 AM',
    sent_by_client: false,
  },
];
