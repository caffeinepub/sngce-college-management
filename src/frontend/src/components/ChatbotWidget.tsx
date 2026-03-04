import { useNavigate } from "@tanstack/react-router";
import { Bot, MessageCircle, Navigation, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type ChatMessage, generateResponse } from "../utils/chatEngine";
import { type GeminiMessage, callGemini } from "../utils/geminiApi";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hey! 👋 I'm SNGCE Assistant — your college guide powered by AI. Ask me anything about courses, fees, faculty, admissions, or anything else. I can also take you to any page in the portal!",
};

/** Render bot text: handle **bold** and newlines */
function BotText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <span className="whitespace-pre-wrap">
      {lines.map((line, li) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: positional text lines
          <span key={`line-${li}`}>
            {li > 0 && <br />}
            {parts.map((part, pi) =>
              pi % 2 === 1 ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional inline parts
                <strong key={`b-${li}-${pi}`}>{part}</strong>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional inline parts
                <span key={`s-${li}-${pi}`}>{part}</span>
              ),
            )}
          </span>
        );
      })}
    </span>
  );
}

const CHIP_LABELS = ["Courses 📚", "Fees 💰", "Admissions 🎓", "Contact 📞"];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Build legacy history for fallback engine
  const getLegacyHistory = (): ChatMessage[] => {
    return messages.slice(1).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      text: m.text,
    }));
  };

  // Scroll to bottom whenever messages or pending state change
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollContainerRef is stable; messages/isPending are intentional triggers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isPending]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  const dispatchMessage = async (text: string) => {
    if (!text || isPending) return;

    const userMsg: Message = { id: `${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsPending(true);

    // Natural typing delay 400–700ms
    const delay = 400 + Math.random() * 300;
    await new Promise<void>((res) => setTimeout(res, delay));

    let responseText = "";
    let redirect: string | undefined;

    try {
      // Try Gemini API first
      const newUserPart: GeminiMessage = {
        role: "user",
        parts: [{ text }],
      };
      const currentHistory = [...geminiHistory, newUserPart];
      const result = await callGemini(text, geminiHistory);
      responseText = result.text;
      redirect = result.redirect;

      // Update Gemini history with both user message and model response
      const modelPart: GeminiMessage = {
        role: "model",
        parts: [
          {
            text:
              result.text +
              (result.redirect ? ` NAVIGATE:${result.redirect}` : ""),
          },
        ],
      };
      setGeminiHistory([...currentHistory, modelPart]);
    } catch (_err) {
      // Fallback to local rule-based engine
      const fallback = generateResponse(text, getLegacyHistory());
      responseText = fallback.text;
      redirect = fallback.redirect;
    }

    const botMsg: Message = {
      id: `${Date.now()}_bot`,
      role: "bot",
      text: redirect
        ? `${responseText} *(Navigating in a moment...)*`
        : responseText,
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsPending(false);

    if (redirect) {
      const target = redirect;
      setIsNavigating(true);
      setTimeout(() => {
        setIsNavigating(false);
        navigate({ to: target });
      }, 1500);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isPending) return;
    setInput("");
    dispatchMessage(text);
  };

  const handleChip = (chip: string) => {
    const text = chip.split(" ")[0];
    dispatchMessage(text);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid="chatbot.open_modal_button"
        className="fixed bottom-6 right-6 z-50 glass-pill p-4 flex items-center gap-2 text-foreground"
        aria-label="Open chatbot"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && <span className="text-sm font-medium pr-1">Ask SNGCE</span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          data-ocid="chatbot.modal"
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: "480px" }}
        >
          <div className="glass h-full flex flex-col rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
              <div className="glass-sm p-1.5 rounded-lg">
                <Bot size={16} className="text-foreground" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">
                  SNGCE Assistant
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {isNavigating ? (
                    <>
                      <Navigation
                        size={10}
                        className="animate-pulse text-foreground/60"
                      />
                      <span>Navigating…</span>
                    </>
                  ) : (
                    "AI-powered · Always here to help"
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="chatbot.close_button"
                className="ml-auto glass-btn p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Close chat"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages — native scroll for reliable scrollIntoView */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-3 py-3 min-h-0"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-6 h-6 rounded-full glass-sm flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0">
                        <Bot size={12} className="text-foreground/70" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-br-sm"
                          : "glass-sm text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <BotText text={msg.text} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}

                {isPending && (
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full glass-sm flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-foreground/70" />
                    </div>
                    <div className="glass-sm rounded-2xl rounded-bl-sm px-3 py-2.5">
                      <span
                        className="flex gap-1 items-center"
                        data-ocid="chatbot.loading_state"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
                <div />
              </div>
            </div>

            {/* Quick suggestion chips — shown only on fresh chat */}
            {messages.length <= 1 && !isPending && (
              <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
                {CHIP_LABELS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChip(chip)}
                    className="glass-sm text-xs px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-white/10 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about SNGCE…"
                data-ocid="chatbot.input"
                className="flex-1 glass-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none rounded-xl border-none"
                disabled={isPending}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isPending}
                data-ocid="chatbot.submit_button"
                className="glass-btn px-3 py-2 text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
