import { ConversationCmdType, MessageCmdType } from '@/types';
import { atom } from 'jotai';

export const chatsAtom = atom<Map<string, ConversationCmdType>>(new Map());
export const selectedChatAtom = atom<ConversationCmdType | null>(null);
export const selectedChatMessagesAtom = atom<MessageCmdType[]>([]);
