"use client";

import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

/* ============== TYPES ============== */
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type LanguageOption = {
  code: string;
  label: string;
  native: string;
};

/* ============== LANGUAGE LIST (trimmed but extendable) ============== */
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "auto", label: "Auto-detect", native: "🌐 Auto" },

  // Major languages
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },

  // Indian block
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

/* ============== PAGE COMPONENT ============== */
export default function KalyuughChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("auto");
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  /* LOAD MESSAGES + LANGUAGE FROM LOCAL STORAGE */
  useEffect(() => {
    const savedMsgs = localStorage.getItem("kalyuugh_messages");
    const savedLang = localStorage.getItem("kalyuugh_language");

    if (savedMsgs) {
      setMessages(JSON.parse(savedMsgs));
    } else {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content:
            "🌸 **Welcome, seeker.** I am the Oracle of Kalyuugh. In this calm space, you can reflect on karma, paap, and dharma. What is on your heart today?",
        },
      ]);
    }

    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("kalyuugh_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("kalyuugh_language", language);
  }, [language]);

  /* CHECK AUTH STATUS (NextAuth) */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth-status");
        if (!res.ok) return;
        const data = await res.json();
        setIsLoggedIn(!!data.isLoggedIn);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const reFocus = () => setTimeout(() => inputRef.current?.focus(), 50);

  /* SEND MESSAGE (STREAMING) */
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const assistantId = nanoid();
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, userMessage],
        language,
      }),
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value || new Uint8Array());
      if (!chunk) continue;

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m
        )
      );
    }

    reFocus();
  }

  /* NEW CHAT */
  const newChat = () => {
    const first: Message = {
      id: nanoid(),
      role: "assistant",
      content:
        "🌸 **A new beginning unfolds…** What truth do you wish to explore this time, seeker?",
    };
    setMessages([first]);
    localStorage.removeItem("kalyuugh_messages");
    setShowMenu(false);
  };

  /* UPLOAD HANDLER (placeholder) */
  const handleUploadClick = () => {
    // This button is only visible if isLoggedIn === true
    // Here you can open a file picker or a modal
    alert("Upload image flow goes here (only for logged-in users).");
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf4ef] via-[#f7f0e8] to-[#f3ece3] text-slate-800 flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-[#e4d6c6] bg-[#fdf7f0]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f6d4c8] to-[#e7c9a8] flex items-center justify-center text-xl font-semibold text-[#5a3a2b]"
            >
              क
            </motion.div>
            <div>
              <h1 className="text-base font-semibold text-[#5a3a2b] tracking-tight">
                Oracle of Kalyuugh
              </h1>
              <p className="text-xs text-[#8f6f5a]">
                A gentle place for introspection, karma, paap & dharma.
              </p>
            </div>
          </div>

          {/* LANGUAGE SWITCHER */}
          <div className="flex flex-col items-end gap-1">
            <label className="text-[10px] uppercase tracking-wide text-[#9b816f]">
              Language
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-white border border-[#e2d3c3] px-2 py-1 rounded-md text-xs text-[#5a3a2b] shadow-sm"
            >
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} — {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 flex justify-center px-3 py-4">
        <div className="w-full max-w-3xl bg-[#fefaf5] border border-[#e4d6c6] rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {/* MESSAGES */}
          <div className="flex-1 px-4 pt-4 pb-2 space-y-4 overflow-y-auto">
            {messages.map(m => (
              <ChatBubble key={m.id} msg={m} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#e4d6c6] to-transparent" />

          {/* INPUT BAR */}
          <div className="px-4 py-3 flex items-end gap-3 bg-[#fdf7f0] relative">
            {/* PLUS + UPWARD MENU */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="h-10 w-10 rounded-full bg-white border border-[#e2d3c3] flex items-center justify-center shadow-sm hover:shadow-md transition"
              >
                <span className="text-[#5a3a2b] text-xl leading-none">+</span>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col bg-white border border-[#e2d3c3] rounded-xl shadow-md px-2 py-2 min-w-[140px]"
                  >
                    {isLoggedIn && (
                      <button
                        onClick={handleUploadClick}
                        className="text-xs text-left text-[#5a3a2b] px-2 py-1.5 rounded-lg hover:bg-[#f5ebe0] transition"
                      >
                        Upload Image
                      </button>
                    )}
                    <button
                      onClick={newChat}
                      className="text-xs text-left text-[#5a3a2b] px-2 py-1.5 rounded-lg hover:bg-[#f5ebe0] transition"
                    >
                      New Chat
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TEXTAREA */}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Share your reflections, thoughts, or confessions…"
              className="flex-1 resize-none bg-white border border-[#e2d3c3] rounded-xl px-3 py-2 text-sm text-[#5a3a2b] placeholder:text-[#b89a84] focus:outline-none focus:ring-1 focus:ring-[#d4b489] max-h-32"
            />

            {/* SEND BUTTON */}
            <button
              onClick={sendMessage}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e7c9a8] to-[#d9b592] flex items-center justify-center shadow-sm hover:shadow-md transition"
            >
              <Send size={16} className="text-[#5a3a2b]" />
            </button>
          </div>

          <p className="px-4 pb-3 text-[10px] text-[#b39378] text-right">
            Enter to send • Shift+Enter for new line • Kalyuugh guides, never judges.
          </p>
        </div>
      </main>
    </div>
  );
}

/* ============== CHAT BUBBLE COMPONENT ============== */
function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
