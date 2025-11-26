import Dexie, { Table } from "dexie";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  conversationId: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

class KalyuughDB extends Dexie {
  messages!: Table<ChatMessage>;
  conversations!: Table<Conversation>;

  constructor() {
    super("KalyuughChatDB");

    this.version(1).stores({
      conversations: "id, updatedAt",
      messages: "id, conversationId, createdAt"
    });
  }
}

export const db = new KalyuughDB();
