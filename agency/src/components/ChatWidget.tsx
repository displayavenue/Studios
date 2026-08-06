import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import "./ChatWidget.css";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatConfig = {
  enabled?: boolean;
  botName?: string;
  welcomeMessage?: string;
  placeholder?: string;
  suggestedPrompts?: string[];
  handoffLabel?: string;
  handoffHref?: string;
};

const DEFAULT_WELCOME =
  "Hi! I’m DA Assist — ask me about DisplayAvenue services, packages, location, or how we can help.";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [handoff, setHandoff] = useState({ label: "Talk to a human", href: "/contact", whatsapp: "" });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/content/chatbot.json", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ChatConfig;
        if (cancelled) return;
        setConfig(data);
        setSuggestions(Array.isArray(data.suggestedPrompts) ? data.suggestedPrompts : []);
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: data.welcomeMessage || DEFAULT_WELCOME,
          },
        ]);
      } catch {
        if (!cancelled) {
          setConfig({ enabled: true, botName: "DA Assist" });
          setMessages([{ id: uid(), role: "assistant", content: DEFAULT_WELCOME }]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    inputRef.current?.focus();
  }, [open, messages, sending]);

  if (config?.enabled === false) return null;

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError("");
    setInput("");
    const userMsg: ChatMsg = { id: uid(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    try {
      const history = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
          website: "", // honeypot
          page: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Could not get a reply");
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: String(data.reply || "") },
      ]);
      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        setSuggestions(data.suggestions);
      }
      if (data.handoff) {
        setHandoff({
          label: data.handoff.label || "Talk to a human",
          href: data.handoff.href || "/contact",
          whatsapp: data.handoff.whatsapp || "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "Sorry — I couldn’t answer just now. Please try again, or contact us via WhatsApp / the Contact page.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const botName = config?.botName || "DA Assist";

  return (
    <div className="da-chat">
      {open && (
        <section className="da-chat-panel" aria-label={`${botName} chat`}>
          <header className="da-chat-head">
            <div>
              <strong>{botName}</strong>
              <span>Answers from DisplayAvenue website content</span>
            </div>
            <button type="button" className="da-chat-icon-btn" aria-label="Close chat" onClick={() => setOpen(false)}>
              <Icon name="close" size={18} color="#fff" />
            </button>
          </header>

          <div className="da-chat-messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`da-chat-bubble ${m.role}`}>
                {m.content.split("\n").map((line, i) => (
                  <p key={`${m.id}-${i}`}>{line}</p>
                ))}
              </div>
            ))}
            {sending && (
              <div className="da-chat-bubble assistant typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="da-chat-suggestions">
              {suggestions.slice(0, 4).map((s) => (
                <button key={s} type="button" onClick={() => void sendMessage(s)} disabled={sending}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="da-chat-form" onSubmit={onSubmit}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="da-chat-honeypot"
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={config?.placeholder || "Ask a question…"}
              rows={2}
              disabled={sending}
              maxLength={1000}
            />
            <button type="submit" className="da-chat-send" disabled={sending || !input.trim()} aria-label="Send">
              <Icon name="arrow" size={18} color="#fff" />
            </button>
          </form>

          <footer className="da-chat-foot">
            {error && <span className="da-chat-error">{error}</span>}
            <div className="da-chat-handoff">
              <Link to={handoff.href || "/contact"} onClick={() => setOpen(false)}>
                {handoff.label || "Talk to a human"}
              </Link>
              {handoff.whatsapp && (
                <a href={handoff.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              )}
            </div>
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`da-chat-launcher ${open ? "open" : ""}`}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "chat"} size={22} color="#fff" />
        {!open && <span className="da-chat-launcher-label">Chat</span>}
      </button>
    </div>
  );
}
