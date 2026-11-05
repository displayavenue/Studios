import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useCms } from "../cms/CmsProvider";
import "./LiveChat.css";

type ChatCta = { label: string; href: string; kind?: string };

type ChatMessage = {
  id: string;
  role: "visitor" | "agent" | string;
  text: string;
  at: string;
  ctas?: ChatCta[];
  provider?: string | null;
};

type ChatState = {
  id: string;
  status: string;
  messages: ChatMessage[];
  bot?: string;
};

const STORAGE_KEY = "da_live_chat_v1";
const API = `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}admin/chat-api.php`;

type StoredSession = {
  conversationId: string;
  visitorToken: string;
  name: string;
  phone: string;
};

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed?.conversationId && parsed?.visitorToken) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function saveSession(session: StoredSession | null) {
  if (!session) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function LiveChat() {
  const { company } = useCms();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<StoredSession | null>(() => loadSession());
  const [chat, setChat] = useState<ChatState | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const seenAgent = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat?.messages.length, open, busy]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(
          `${API}?action=poll&conversationId=${encodeURIComponent(session.conversationId)}&visitorToken=${encodeURIComponent(session.visitorToken)}`,
          { credentials: "same-origin" },
        );
        const json = await res.json();
        if (cancelled || !json.ok) return;
        const next = json.chat as ChatState;
        setChat(next);
        if (!open) {
          const agentMsgs = (next.messages || []).filter((m) => m.role === "agent");
          const fresh = agentMsgs.filter((m) => !seenAgent.current.has(m.id));
          if (fresh.length) setUnread((u) => u + fresh.length);
        } else {
          (next.messages || []).forEach((m) => {
            if (m.role === "agent") seenAgent.current.add(m.id);
          });
          setUnread(0);
        }
      } catch {
        /* ignore transient */
      }
    };
    poll();
    const t = window.setInterval(poll, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [session, open]);

  async function startChat(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: "start",
          name: name.trim() || "Visitor",
          phone: phone.trim(),
          page: window.location.pathname,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not start chat");
      const nextSession = {
        conversationId: json.conversationId as string,
        visitorToken: json.visitorToken as string,
        name: name.trim() || "Visitor",
        phone: phone.trim(),
      };
      setSession(nextSession);
      saveSession(nextSession);
      setChat(json.chat as ChatState);
      (json.chat.messages || []).forEach((m: ChatMessage) => {
        if (m.role === "agent") seenAgent.current.add(m.id);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start chat");
    } finally {
      setBusy(false);
    }
  }

  async function sendText(text: string) {
    if (!session || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: "send",
          conversationId: session.conversationId,
          visitorToken: session.visitorToken,
          text: text.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Send failed");
      setChat(json.chat as ChatState);
      (json.chat.messages || []).forEach((m: ChatMessage) => {
        if (m.role === "agent") seenAgent.current.add(m.id);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    try {
      await sendText(text);
    } catch {
      setDraft(text);
    }
  }

  async function onCta(cta: ChatCta) {
    if (cta.href.startsWith("#intent:")) {
      await sendText(cta.href);
      return;
    }
    window.open(cta.href, "_blank", "noopener,noreferrer");
  }

  function endChat() {
    setSession(null);
    setChat(null);
    saveSession(null);
    seenAgent.current = new Set();
    setUnread(0);
  }

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      if (next) setUnread(0);
      return next;
    });
  }

  const lastAgent = [...(chat?.messages || [])].reverse().find((m) => m.role === "agent");

  return (
    <div className="da-chat">
      {open ? (
        <section className="da-chat__panel" aria-label="DA Growth AI chat">
          <header className="da-chat__head">
            <div>
              <strong>DA Growth AI</strong>
              <span>Instant answers · Qualifies · Converts to WhatsApp</span>
            </div>
            <button type="button" className="da-chat__x" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </header>

          {!session || !chat ? (
            <form className="da-chat__pre" onSubmit={startChat}>
              <p>
                Chat with our AI growth assistant for Google Ads, Meta Ads, SEO, websites, and lead
                generation — then convert to WhatsApp when you are ready.
              </p>
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
              </label>
              <label>
                Phone / WhatsApp
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9222 122333"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>
              {error ? <p className="da-chat__err">{error}</p> : null}
              <button type="submit" className="da-chat__send" disabled={busy}>
                {busy ? "Starting…" : "Chat with AI"}
              </button>
              <a className="da-chat__wa" href={company.whatsappHref} target="_blank" rel="noreferrer">
                Prefer WhatsApp →
              </a>
            </form>
          ) : (
            <>
              <div className="da-chat__msgs" ref={listRef}>
                {chat.messages.map((m) => (
                  <div key={m.id} className={`da-chat__bubble da-chat__bubble--${m.role === "visitor" ? "me" : "them"}`}>
                    {m.role !== "visitor" ? <span className="da-chat__who">DA Growth AI</span> : null}
                    <p>{m.text}</p>
                    {m.ctas && m.ctas.length ? (
                      <div className="da-chat__ctas">
                        {m.ctas.map((cta) => (
                          <button key={cta.label + cta.href} type="button" className={`da-chat__cta da-chat__cta--${cta.kind || "default"}`} onClick={() => onCta(cta)}>
                            {cta.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {busy ? (
                  <div className="da-chat__bubble da-chat__bubble--them da-chat__typing">
                    <span className="da-chat__who">DA Growth AI</span>
                    <p>Typing…</p>
                  </div>
                ) : null}
              </div>

              {lastAgent?.ctas?.length ? (
                <div className="da-chat__quick">
                  {lastAgent.ctas.slice(0, 4).map((cta) => (
                    <button key={`q-${cta.label}`} type="button" onClick={() => onCta(cta)} disabled={busy}>
                      {cta.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {error ? <p className="da-chat__err da-chat__err--pad">{error}</p> : null}
              <form className="da-chat__compose" onSubmit={sendMessage}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about ads, SEO, website…"
                  maxLength={2000}
                  disabled={busy || chat.status === "closed"}
                />
                <button type="submit" disabled={busy || !draft.trim() || chat.status === "closed"}>
                  Send
                </button>
              </form>
              <div className="da-chat__foot">
                <button type="button" onClick={endChat}>
                  New chat
                </button>
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <a href={company.phoneHref}>Call</a>
              </div>
            </>
          )}
        </section>
      ) : null}

      <button type="button" className="da-chat__launcher" onClick={toggleOpen} aria-label="Open DA Growth AI chat">
        <span className="da-chat__launcher-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path
              fill="currentColor"
              d="M12 3c-4.97 0-9 3.58-9 8 0 2.4 1.16 4.55 3 6.05V21l3.4-1.87c.82.24 1.69.37 2.6.37 4.97 0 9-3.58 9-8s-4.03-8-9-8zm1.2 10.9-2.35-1.78-3.35 1.78L11 9.2l2.4 1.8L16.6 9.2l-3.4 4.7z"
            />
          </svg>
        </span>
        <span className="da-chat__launcher-label">AI Chat</span>
        {unread > 0 ? <span className="da-chat__badge">{unread > 9 ? "9+" : unread}</span> : null}
      </button>
    </div>
  );
}
