import { useNavigate } from "@tanstack/react-router";
import {
  Bot,
  MessageCircle,
  Navigation,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { type GroqMessage, callGroq } from "../utils/groqApi";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  isMulti?: boolean;
}

function getWelcome(role: string | null, userName: string | null): Message {
  let text: string;
  if (role === "student") {
    text = `Hi ${userName || "there"}! I can help you with your timetable, attendance calculation, exam schedule, upcoming fests, and anything else about SNGCE. What do you need?`;
  } else if (role === "staff") {
    text = `Hello ${userName || "there"}! I can help you navigate the staff panel, enter attendance or marks, understand student records, or answer any college-related questions.`;
  } else if (role === "admin") {
    text = `Welcome ${userName || "Admin"}! I can assist with course management, faculty, fees, classified documents, and any institutional queries.`;
  } else {
    text =
      "Hi! I'm the SNGCE Assistant. Ask me anything about courses, admissions, fees, placements, or general questions!";
  }
  return { id: "welcome", role: "bot", text };
}

function getChips(role: string | null): string[] {
  if (role === "student")
    return [
      "My timetable",
      "Attendance calculator",
      "Upcoming fests",
      "Exam schedule",
    ];
  if (role === "staff")
    return [
      "Enter attendance",
      "Enter student marks",
      "View timetable",
      "Student records",
    ];
  if (role === "admin")
    return [
      "Manage courses",
      "Add faculty",
      "Fee structure",
      "Classified docs",
    ];
  return ["Courses offered", "Fee structure", "Admissions", "Placements"];
}

function detectMultipleQueries(text: string): boolean {
  const questionMarks = (text.match(/\?/g) || []).length;
  if (questionMarks >= 2) return true;
  return (
    /\b(also|and also|what about|plus|another question)\b/i.test(text) &&
    text.includes("?")
  );
}

function BotText({ text }: { text: string }) {
  return (
    <span className="whitespace-pre-wrap">
      {text.split("\n").map((line, li) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: positional text lines
          <span key={`l${li}`}>
            {li > 0 && <br />}
            {parts.map((p, pi) =>
              pi % 2 === 1 ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional inline parts
                <strong key={`b${li}${pi}`}>{p}</strong>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional inline parts
                <span key={`s${li}${pi}`}>{p}</span>
              ),
            )}
          </span>
        );
      })}
    </span>
  );
}

export function ChatbotWidget() {
  const { role, studentId, userName } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    getWelcome(role, userName),
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [history, setHistory] = useState<GroqMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMessages([getWelcome(role, userName)]);
    setHistory([]);
  }, [role, userName]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollRef is stable; messages/isPending are intentional triggers
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    setErrorMsg("");
    const isMulti = detectMultipleQueries(trimmed);
    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      text: trimmed,
      isMulti,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsPending(true);

    const newHistory: GroqMessage[] = [
      ...history,
      { role: "user", content: trimmed },
    ];

    try {
      const result = await callGroq(trimmed, history, {
        role,
        studentId,
        userName,
      });

      setHistory([...newHistory, { role: "assistant", content: result.text }]);

      const botMsg: Message = {
        id: `b${Date.now()}`,
        role: "bot",
        text: result.redirect
          ? `${result.text}\n\n*(Taking you there now...)*`
          : result.text,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (result.redirect) {
        const target = result.redirect;
        setIsNavigating(true);
        if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
          navigate({ to: target });
        }, 1500);
      }
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(`Couldn't reach AI: ${errText}`);
      setMessages((prev) => [
        ...prev,
        {
          id: `b${Date.now()}`,
          role: "bot",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (text) send(text);
  };

  const chips = getChips(role);

  return (
    <>
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

      {open && (
        <div
          data-ocid="chatbot.modal"
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          style={{ height: "500px" }}
        >
          <div className="glass h-full flex flex-col rounded-2xl overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10 flex-shrink-0">
              <div className="glass-sm p-1.5 rounded-lg">
                <Bot size={16} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">
                  SNGCE Assistant
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {isNavigating ? (
                    <>
                      <Navigation size={10} className="animate-pulse" />{" "}
                      <span>Navigating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={10} /> <span>Powered by Groq AI</span>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="chatbot.close_button"
                className="glass-btn p-1.5 text-muted-foreground hover:text-foreground ml-auto"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-3 min-h-0"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <div
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
                    {msg.isMulti && msg.role === "user" && (
                      <div className="flex justify-end mt-1">
                        <span className="glass-sm text-[10px] text-muted-foreground px-2 py-0.5 rounded-full">
                          Multiple questions detected
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {isPending && (
                  <div className="flex justify-start items-start gap-1.5">
                    <div className="w-6 h-6 rounded-full glass-sm flex items-center justify-center flex-shrink-0 mt-0.5">
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
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Sparkles size={8} className="animate-pulse" />{" "}
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <p
                    className="text-xs text-destructive text-center px-2"
                    data-ocid="chatbot.error_state"
                  >
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>

            {messages.length <= 1 && !isPending && (
              <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => send(chip)}
                    className="glass-sm text-xs px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div className="px-3 pb-3 pt-2 border-t border-white/10 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder={
                  role === "student"
                    ? "Ask about timetable, attendance..."
                    : "Ask anything about SNGCE..."
                }
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
                aria-label="Send"
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
