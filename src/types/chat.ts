export type ChatMessage = {
  from: 'user' | 'ai';
  msg: string;
  timestamp: string;
};

export type Chat = {
  id: string;
  chats: ChatMessage[];
};

export const CHAT_STORAGE_KEY = 'chatStorage';