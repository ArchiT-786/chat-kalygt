import { db, ChatMessage, Conversation } from "./db";

export const chatStore = {
  /* -------------------------------
      CONVERSATION MANAGEMENT
  -------------------------------- */
  async createConversation(title: string) {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.conversations.add(conv);
    return conv;
  },

  async listConversations() {
    return await db.conversations.orderBy("updatedAt").reverse().toArray();
  },

  async renameConversation(id: string, title: string) {
    await db.conversations.update(id, { title, updatedAt: Date.now() });
  },

  async deleteConversation(id: string) {
    await db.messages.where("conversationId").equals(id).delete();
    await db.conversations.delete(id);
  },

  /* -------------------------------
      MESSAGE MANAGEMENT
  -------------------------------- */
  async addMessage(msg: ChatMessage) {
    await db.messages.add(msg);
    await db.conversations.update(msg.conversationId, { updatedAt: Date.now() });
  },

  async getMessages(conversationId: string) {
    return await db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("createdAt");
  },
};
