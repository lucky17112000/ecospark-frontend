"use client";

import { useState, useRef, useEffect } from "react";
import {
  BotIcon,
  LeafIcon,
  MessageCircleIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { text: string; sender: "user" | "bot" };

const QUICK_REPLIES = [
  "What is EcoSpark?",
  "How to submit an idea?",
  "Pricing & Plans",
  "Contact support",
];

const getReply = (msg: string): string => {
  const t = msg.toLowerCase().trim();

  if (/^(hi|hello|hey|howdy|good\s|greetings)/.test(t))
    return "Hello! 👋 Welcome to EcoSpark. How can I help you today?";

  if (/(what is ecospark|about ecospark|who are you|tell me about)/.test(t))
    return "EcoSpark is a community-driven platform where people share, discover, and vote on sustainability ideas — from simple daily habits to large-scale eco projects. 🌱";

  if (/(service|what do you offer|what can i do|feature)/.test(t))
    return "EcoSpark lets you:\n• Browse & vote on eco ideas\n• Submit your own sustainability ideas\n• Fund or purchase impactful projects\n• Connect with a green community 🌍";

  if (/(price|pricing|cost|plan|how much|free|paid|subscription)/.test(t))
    return "Browsing and voting are 100% free! Creating and submitting ideas is also free. Some premium features may require a subscription in the future. 💚";

  if (/(contact|email|support|help|reach|phone)/.test(t))
    return "You can reach us at support@ecospark.com or visit our Contact page. We aim to respond within 1–2 business days! 📧";

  if (/(submit|create|share|post|idea|upload|how to submit)/.test(t))
    return "To submit an idea:\n1. Register a free account\n2. Go to your Dashboard\n3. Click 'Create Idea'\n4. Fill in details & submit for review 🚀";

  if (/(vote|voting|upvote|support idea|like)/.test(t))
    return "You can vote on any idea by opening it and clicking the Vote button. The most voted ideas get reviewed by our admin team for potential funding! 🗳️";

  if (/(login|sign in|account|register|sign up|join)/.test(t))
    return "Register for free at /register or log in at /login. Your account gives you full access to submit ideas, vote, and purchase eco projects! 🔑";

  if (/(dashboard|my ideas|my profile|profile)/.test(t))
    return "Your dashboard is your personal hub — view submitted ideas, track their status, manage purchased projects, and update your profile. 📊";

  if (/(thank|thanks|appreciate|great|awesome|perfect|cool)/.test(t))
    return "You're welcome! 😊 Is there anything else I can help you with?";

  if (/(bye|goodbye|see you|cya|ttyl)/.test(t))
    return "Goodbye! 🌿 Come back anytime. Together we can make the world greener!";

  return "I'm not sure I understood that. You can ask me about EcoSpark's services, how to submit ideas, pricing, or contact info. Or visit our Contact page for more help! 🌿";
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! 👋 I'm the EcoSpark assistant. Ask me anything about our platform!",
      sender: "bot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }, [messages, isTyping, open]);

  const sendMessage = (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInput("");
    setShowQuickReplies(false);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: getReply(trimmed), sender: "bot" },
      ]);
      setIsTyping(false);
    }, 750);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open EcoSpark chat"}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-110",
          "bg-emerald-600 text-white hover:bg-emerald-700",
        )}
      >
        <span
          className={cn(
            "absolute transition-all duration-300",
            open ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          <XIcon className="size-5" />
        </span>
        <span
          className={cn(
            "absolute transition-all duration-300",
            open ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <MessageCircleIcon className="size-6" />
        </span>
      </button>

      {/* ── Chat window ── */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex w-80 origin-bottom-right flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 sm:w-96",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-90 opacity-0 pointer-events-none translate-y-2",
        )}
        style={{ maxHeight: "min(560px, calc(100dvh - 120px))" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 bg-emerald-600 px-4 py-3.5">
          <div className="flex size-9 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/10">
            <LeafIcon className="size-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              EcoSpark Assistant
            </p>
            <p className="text-xs text-emerald-100">Always here to help 🌿</p>
          </div>
          <span className="size-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-500" />
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex items-end gap-2",
                m.sender === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              {m.sender === "bot" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <BotIcon className="size-3.5" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                  m.sender === "user"
                    ? "rounded-br-sm bg-emerald-600 text-white"
                    : "rounded-bl-sm bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                <BotIcon className="size-3.5" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3.5">
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce delay-150" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          {/* Quick replies — shown only after the welcome message */}
          {showQuickReplies && messages.length === 1 && !isTyping && (
            <div className="mt-1 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex shrink-0 items-center gap-2 border-t bg-background px-3 py-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            className="h-10 flex-1 rounded-lg border bg-muted/50 px-3 text-sm outline-none ring-offset-background transition focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <SendIcon className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
