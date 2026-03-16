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
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-surface border border-border rounded-bl-md"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <Coins className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium">Uncommon Cents</span>
          </div>
        )}
        <div
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? "text-white" : "text-text-primary"
          }`}
        >
          {message.content.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className={isUser ? "text-white" : "text-accent-dark"}>
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
    <div className="min-h-screen pt-14 flex flex-col">
      <div className="border-b border-border-light bg-background/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-text-muted hover:text-text-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-semibold">Ask Uncommon Cents</h1>
              <p className="text-xs text-text-muted">Financial education, not advice</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setInput(""); }}
              className="text-text-muted hover:text-text-secondary p-1.5 rounded-lg hover:bg-surface transition-colors"
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
              <Coins className="w-10 h-10 text-accent mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                What do you want to understand?
              </h2>
              <p className="text-text-muted text-sm text-center max-w-sm mb-8">
                Ask about any financial strategy, tax concept, or retirement
                planning question. Get clear answers with real numbers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm bg-surface border border-border rounded-lg px-3 py-2.5 text-text-secondary hover:border-accent/30 hover:text-text-primary transition-colors"
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
                  <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Coins className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs text-accent font-medium">Uncommon Cents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
                      <span className="text-xs text-text-muted">Running the numbers...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border-light bg-background/80 backdrop-blur-sm px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any financial strategy..."
            rows={1}
            className="flex-1 resize-none bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors"
            style={{ maxHeight: "120px" }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-accent text-white p-2.5 rounded-xl hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
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
