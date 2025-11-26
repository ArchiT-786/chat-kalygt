"use client";

import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Trash2, Edit3, MessagesSquare } from "lucide-react";

import { chatStore } from "@/lib/chatStore";
import { ChatMessage } from "@/lib/db";

/* =======================================================
   MAIN CHAT PAGE WITH MULTI-CHAT SUPPORT
======================================================= */
export default function KalyuughChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("auto");
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  /* =======================================================
     LOAD ALL CONVERSATIONS
  ======================================================== */
  useEffect(() => {
    chatStore.listConversations().then((convs) => {
      setConversations(convs);

      // Auto-load the first conversation or create one
      if (convs.length > 0) {
        setCurrentConversationId(convs[0].id);
      } else {
        createNewConversation();
      }
    });
  }, []);

  /* =======================================================
     LOAD MESSAGES FOR CURRENT CONVERSATION
  ======================================================== */
  useEffect(() => {
    if (!currentConversationId) return;

    chatStore.getMessages(currentConversationId).then((msgs) => {
      if (msgs.length === 0) {
        const firstMsg: ChatMessage = {
          id: nanoid(),
          role: "assistant",
          content:
            "🌸 **Welcome, seeker.** What truth weighs upon your heart today?",
          createdAt: Date.now(),
          conversationId: currentConversationId,
        };
        setMessages([firstMsg]);
        chatStore.addMessage(firstMsg);
      } else {
        setMessages(msgs);
      }
    });
  }, [currentConversationId]);

  /* =======================================================
     SCROLL TO BOTTOM
  ======================================================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =======================================================
     CREATE NEW CONVERSATION
  ======================================================== */
  async function createNewConversation() {
    const conv = await chatStore.createConversation("New Conversation");
    setConversations((prev) => [conv, ...prev]);
    setCurrentConversationId(conv.id);
  }

  /* =======================================================
     SEND MESSAGE
  ======================================================== */
  async function sendMessage() {
    if (!input.trim() || !currentConversationId) return;

    const userMsg: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
      conversationId: currentConversationId,
    };

    setMessages((prev) => [...prev, userMsg]);
    chatStore.addMessage(userMsg);
    setInput("");

    // Create assistant placeholder
    const assistantId = nanoid();
    const placeholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      conversationId: currentConversationId,
    };
    setMessages((prev) => [...prev, placeholder]);

    let fullResponse = "";

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: userMsg.content }], // only latest msg
        language,
        conversationId: currentConversationId,
      }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullResponse += chunk;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m
        )
      );
    }

    // Store final assistant message
    chatStore.addMessage({
      id: assistantId,
      role: "assistant",
      content: fullResponse,
      createdAt: Date.now(),
      conversationId: currentConversationId,
    });

    // Store to Pinecone (mapped)
    // fetch("/api/store-chat", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     question: userMsg.content,
    //     answer: fullResponse,
    //     conversationId: currentConversationId,
    //   }),
    // });
  }

  /* =======================================================
     RENAME CURRENT CONVERSATION
  ======================================================== */
  function startRename() {
    const conv = conversations.find((c) => c.id === currentConversationId);
    if (!conv) return;
    setNewTitle(conv.title);
    setEditingTitle(true);
  }

  async function finishRename() {
    if (!currentConversationId) return;
    await chatStore.renameConversation(currentConversationId, newTitle);
    setEditingTitle(false);
    setConversations(await chatStore.listConversations());
  }

  /* =======================================================
     DELETE CONVERSATION
  ======================================================== */
  async function deleteConversation(id: string) {
    await chatStore.deleteConversation(id);

    const newList = await chatStore.listConversations();
    setConversations(newList);

    if (newList.length > 0) {
      setCurrentConversationId(newList[0].id);
    } else {
      createNewConversation();
    }
  }

  /* =======================================================
     UI RENDER
  ======================================================== */
  return (
    <div className="flex min-h-screen bg-[#f7f0e8]">
      {/* ============================ SIDEBAR ============================= */}
      <aside className="w-64 border-r border-[#e4d6c6] bg-[#faf4ef] p-4 flex flex-col gap-4">

        <button
          onClick={createNewConversation}
          className="flex items-center gap-2 px-3 py-2 bg-[#e7c9a8] hover:bg-[#d9b592] text-[#5a3a2b] rounded-md shadow-sm"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setCurrentConversationId(c.id)}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center hover:bg-[#f4e8db] ${
                currentConversationId === c.id
                  ? "bg-[#f4e8db] border border-[#d4b489]"
                  : "border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessagesSquare size={14} className="text-[#5a3a2b]" />
                <span className="text-sm text-[#5a3a2b]">{c.title}</span>
              </div>

              <div className="flex gap-2">
                <Edit3
                  size={14}
                  className="text-[#5a3a2b] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentConversationId(c.id);
                    startRename();
                  }}
                />

                <Trash2
                  size={14}
                  className="text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ============================ CHAT AREA ============================ */}
      <main className="flex-1 flex flex-col">
        {/* HEADER TITLE */}
        <header className="p-4 border-b border-[#e4d6c6] bg-[#fdf7f0] flex justify-between">
          {editingTitle ? (
            <div className="flex gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-2 py-1 border rounded-md text-sm"
              />
              <button
                onClick={finishRename}
                className="px-3 py-1 bg-[#e7c9a8] rounded-md text-[#5a3a2b]"
              >
                Save
              </button>
            </div>
          ) : (
            <h1 className="text-lg text-[#5a3a2b] font-semibold">
              {conversations.find((c) => c.id === currentConversationId)?.title}
            </h1>
          )}
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fefaf5]">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-3 border-t border-[#e4d6c6] bg-[#fdf7f0] flex items-end gap-3">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 resize-none bg-white border border-[#e2d3c3] rounded-xl px-3 py-2 text-sm text-[#5a3a2b]"
            placeholder="Ask the Oracle of Kalyuugh..."
          />

          <button
            onClick={sendMessage}
            className="h-10 w-10 bg-gradient-to-br from-[#e7c9a8] to-[#d9b592] rounded-full flex items-center justify-center"
          >
            <Send size={16} className="text-[#5a3a2b]" />
          </button>
        </div>
      </main>
    </div>
  );
}

/* =======================================================
   CHAT BUBBLE COMPONENT
======================================================= */
function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-white border border-[#e0d3c5] text-[#4b3a2c]"
            : "bg-[#fbf1e4] border border-[#e1c8aa] text-[#4b3522]"
        }`}
      >
        {msg.content}
      </motion.div>
    </div>
  );
}
