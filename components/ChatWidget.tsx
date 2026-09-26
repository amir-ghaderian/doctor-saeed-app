"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "پاسخی دریافت نشد." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "خطا در برقراری ارتباط. دوباره تلاش کن." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div dir="rtl" style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000 }}>
      {open ? (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f97316",
              color: "#fff",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "sans-serif",
            }}
          >
            <span>دستیار هوش مصنوعی</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, fontFamily: "sans-serif" }}>
            {messages.length === 0 && (
              <div style={{ color: "#999", fontSize: 14, textAlign: "center", marginTop: 20 }}>
                سوالت رو بپرس تا شروع کنیم
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "left" : "right",
                  margin: "8px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: m.role === "user" ? "#f3f4f6" : "#fff7ed",
                    color: "#111",
                    maxWidth: "80%",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: "right", fontSize: 13, color: "#999" }}>در حال تایپ...</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #eee", padding: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خودت رو بنویس..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 14,
                padding: "6px 8px",
                fontFamily: "sans-serif",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              ارسال
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#f97316",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            cursor: "pointer",
            fontSize: 24,
          }}
        >
          💬
        </button>
      )}
    </div>
  );
}