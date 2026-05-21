"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  context: Record<string, unknown>;
  contextType: "topic" | "article";
  placeholder?: string;
}

export default function ChatBox({ context, contextType, placeholder }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const updated: Message[] = [...messages, { role: "user", content: question }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          contextType,
          messages: updated.slice(-8),
          question,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.answer }]);
    } catch {
      setError(true);
      setMessages(updated.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-[#1e1e1e] pt-5 mt-5">
      <p className="text-[#c8a96e] text-xs font-sans uppercase tracking-widest mb-3">Ask a Question</p>

      {messages.length > 0 && (
        <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              {m.role === "user" ? (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 max-w-xs">
                  <p className="text-[#e0e0e0] text-xs font-sans leading-relaxed">{m.content}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[#555] text-xs font-sans uppercase tracking-widest">Analysis</p>
                  {m.content.split(/\n+/).filter(Boolean).map((p, j) => (
                    <p key={j} className="text-[#aaa] text-sm font-sans leading-relaxed">{p}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-[#444]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs font-sans">Thinking...</span>
            </div>
          )}
          {error && (
            <p className="text-[#c87070] text-xs font-sans">Failed to respond. Try again.</p>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder || "Ask anything about this topic..."}
          className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-[#c0c0c0] text-xs font-sans px-3 py-2.5 placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-3 py-2.5 border border-[#2a2a2a] text-[#c8a96e] hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[#333] text-xs font-sans mt-1.5">Press Enter to send</p>
    </div>
  );
}
