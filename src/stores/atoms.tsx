import { atom, useSetAtom } from 'jotai';
import { ConversationCmdType } from '@/types';

export const chatsAtom = atom<Map<string, ConversationCmdType>>(new Map());
export const selectedChatAtom = atom<ConversationCmdType | null>(null);
