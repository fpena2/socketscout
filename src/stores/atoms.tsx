import { atom, useSetAtom } from 'jotai';
import { Chat } from '@/types';

export const chatsAtom = atom<Map<string, Chat>>(new Map());
export const selectedChatAtom = atom<Chat | null>(null);
