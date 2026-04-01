"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; text: string };

export default function SupportChat({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Bonjour ! Je suis l'assistant ReviewUp. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userEmail }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply ?? "Une erreur est survenue." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Erreur de connexion. Réessayez." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-white text-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        aria-label="Support"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Fenêtre chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "460px" }}>
          {/* Header */}
          <div className="px-4 py-3 text-white text-sm font-semibold flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
            <span>🤖</span>
            <span>Assistant ReviewUp</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" style={{ minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === "user"
                    ? "text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}
                  style={m.role === "user" ? { background: "linear-gradient(135deg, #667eea, #764ba2)" } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 px-3 py-2 rounded-2xl rounded-bl-sm text-xs">
                  En train d'écrire...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Votre question..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-2 outline-none focus:border-[#667eea] transition"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 cursor-pointer hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
