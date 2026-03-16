"use client";

import { useState, useRef, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Loader2,
  Coins,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "Should I do a Roth conversion this year?",
  "Can you save too much in a 401k?",
  "How do I use my HSA as a retirement account?",
  "What is a backdoor Roth IRA?",
  "How does tax-loss harvesting work?",
  "Is whole life insurance ever worth it?",
  "When does DCA beat lump sum investing?",
  "How do I reduce taxes in retirement?",
  "What's the order of operations for investing?",
  "Should I pay off my mortgage or invest?",
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3`}
        style={
          isUser
            ? {
                backgroundColor: "#2C5F7C",
                color: "#F5EDE0",
                borderBottomRightRadius: "4px",
                boxShadow: "0 2px 12px rgba(44,95,124,0.25)",
              }
            : {
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(196,166,122,0.3)",
                borderBottomLeftRadius: "4px",
                boxShadow: "0 2px 8px rgba(44,95,124,0.08)",
              }
        }
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <Coins className="w-3.5 h-3.5" style={{ color: "#E05A1B" }} />
            <span className="text-xs font-medium" style={{ color: "#E05A1B" }}>Uncommon Cents</span>
          </div>
        )}
        <div
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: isUser ? "#F5EDE0" : "#1A1A1A" }}
        >
          {message.content.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} style={{ color: isUser ? "#F5EDE0" : "#2C5F7C" }}>
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function AskPageContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic) {
      setInput(`Tell me about ${topic}`);
      inputRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("[ask] Chat send failed:", error instanceof Error ? error.message : error);
      setMessages([
        ...updatedMessages,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen pt-14 flex flex-col" style={{ backgroundColor: "#F5EDE0" }}>
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(196,166,122,0.3)",
          backgroundColor: "rgba(245,237,224,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="transition-colors"
              style={{ color: "#555555" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-semibold font-heading" style={{ color: "#1A1A1A" }}>Ask Uncommon Cents</h1>
              <p className="text-xs" style={{ color: "#555555" }}>Financial education, not advice</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setInput(""); }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#555555" }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Coins className="w-10 h-10 mb-4" style={{ color: "#E05A1B" }} />
              <h2 className="text-xl font-semibold mb-2 font-heading" style={{ color: "#1A1A1A" }}>
                What do you want to understand?
              </h2>
              <p className="text-sm text-center max-w-sm mb-8" style={{ color: "#555555" }}>
                Ask about any financial strategy, tax concept, or retirement
                planning question. Get clear answers with real numbers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm rounded-lg px-3 py-2.5 transition-colors"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(196,166,122,0.3)",
                      color: "#555555",
                      boxShadow: "0 1px 4px rgba(44,95,124,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(44,95,124,0.4)";
                      e.currentTarget.style.color = "#1A1A1A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(196,166,122,0.3)";
                      e.currentTarget.style.color = "#555555";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div
                    className="rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(196,166,122,0.3)",
                      borderBottomLeftRadius: "4px",
                      boxShadow: "0 2px 8px rgba(44,95,124,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Coins className="w-3.5 h-3.5" style={{ color: "#E05A1B" }} />
                      <span className="text-xs font-medium" style={{ color: "#E05A1B" }}>Uncommon Cents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#555555" }} />
                      <span className="text-xs" style={{ color: "#555555" }}>Running the numbers...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div
        className="px-4 py-3"
        style={{
          borderTop: "1px solid rgba(196,166,122,0.3)",
          backgroundColor: "rgba(245,237,224,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any financial strategy..."
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(196,166,122,0.4)",
              color: "#1A1A1A",
              maxHeight: "120px",
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#E05A1B", color: "#FFFFFF" }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense>
      <AskPageContent />
    </Suspense>
  );
}
