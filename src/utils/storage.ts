import { Chat, CHAT_STORAGE_KEY } from "../types/chat";

export function getChats(): Chat[] {
  const data = localStorage.getItem(CHAT_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveChats(chats: Chat[]): void {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

export function createChat(id: string): void {
  const chats = getChats();
  if (chats.some((chat) => chat.id === id)) return;

  const newChat: Chat = {
    id,
    chats: [],
    date: new Date(),
  };

  chats.push(newChat);
  saveChats(chats);
}

export function deleteChat(id: string): void {
  const chats = getChats().filter((chat) => chat.id !== id);
  saveChats(chats);
}

export function addMessageToChat(
  id: string,
  from: "user" | "ai",
  msg: string
): void {
  const chats = getChats();
  const timestamp = new Date().toISOString();

  const chat = chats.find((chat) => chat.id === id);
  if (!chat) return;

  chat.chats.push({ from, msg, timestamp });
  saveChats(chats);
}

export function getChatById(id: string): Chat | undefined {
  const chats = getChats();
  return chats.find((chat) => chat.id === id);
}
