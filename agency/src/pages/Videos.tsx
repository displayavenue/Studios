import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import {
  fallbackVideos,
  sortVideoReels,
  typeLabel,
  type VideoReel,
  type VideosCms,
} from "../data/videos";
import { useCms } from "../cms/CmsProvider";
import "../styles/pages.css";
import "./Videos.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export function useVideos(): { videos: VideosCms; loading: boolean } {
  const [videos, setVideos] = useState<VideosCms>(fallbackVideos);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch(`${base}content/videos.json`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data) return;
        setVideos({
          ...fallbackVideos,
          ...data,
          reels: Array.isArray(data.reels) ? data.reels : [],
        });
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { videos, loading };
}

function mediaUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.replace(/^\//, "")}`;
}

type PlayerProps = {
  reel: VideoReel;
  speakerFallback: string;
  speakerName: string;
  active: boolean;
  onActivate: () => void;
};

function TalkingReelPlayer({
  reel,
  speakerFallback,
  speakerName,
  active,
  onActivate,
}: PlayerProps) {
  const portrait = mediaUrl(reel.speakerImage || speakerFallback);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [captionIdx, setCaptionIdx] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const captions = reel.captions?.length
    ? reel.captions
    : (reel.lines || []).map((text, i) => ({ t: i * 2.5, text }));
  const duration = Math.max(reel.durationSec || 12, captions.length ? captions[captions.length - 1].t + 2.5 : 12);

  const stopSpeech = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    utterRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    stopSpeech();
    setPlaying(false);
  }, [stopSpeech]);

  useEffect(() => {
    if (!active && playing) stop();
  }, [active, playing, stop]);

  useEffect(() => () => stop(), [stop]);

  const tick = useCallback(
    (now: number) => {
      const t = (now - startRef.current) / 1000;
      if (t >= duration) {
        setElapsed(duration);
        setPlaying(false);
        stopSpeech();
        return;
      }
      setElapsed(t);
      let idx = 0;
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].t <= t) idx = i;
      }
      setCaptionIdx(idx);
      rafRef.current = requestAnimationFrame(tick);
    },
    [captions, duration, stopSpeech],
  );

  const speak = useCallback(() => {
    stopSpeech();
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    const text = reel.script || captions.map((c) => c.text).join(". ");
    if (!text.trim()) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1;
    u.lang = "en-IN";
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en-IN/i.test(v.lang) && /male|ravi|ashwin/i.test(v.name)) ||
      voices.find((v) => /en-IN/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, [captions, muted, reel.script, stopSpeech]);

  const play = () => {
    onActivate();
    stop();
    setElapsed(0);
    setCaptionIdx(0);
    setPlaying(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    speak();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (next) stopSpeech();
    else if (playing) speak();
  };

  const caption = captions[captionIdx]?.text || reel.title;
  const progress = Math.min(1, elapsed / duration);

  return (
    <article
      className={`talk-reel ${playing ? "is-playing" : ""} ${active ? "is-active" : ""} ${portrait ? "has-portrait" : "no-portrait"}`}
    >
      <div className="talk-reel__stage" aria-label={`${reel.title} talking reel`}>
        <div className="talk-reel__bg" aria-hidden />
        {portrait ? (
          <img
            className="talk-reel__portrait"
            src={portrait}
            alt={reel.speakerName || speakerName}
            draggable={false}
          />
        ) : (
          <div className="talk-reel__placeholder">
            <p>Upload your photo in Admin → Video Studio</p>
            <p className="talk-reel__placeholder-sub">Reels will look like you speaking</p>
          </div>
        )}
        <div className="talk-reel__vignette" aria-hidden />
        <div className={`talk-reel__mouth ${playing ? "is-speaking" : ""}`} aria-hidden />
        <div className="talk-reel__chrome">
          <span className="talk-reel__badge">{typeLabel(reel.type)}</span>
          <span className="talk-reel__cat">{reel.category}</span>
        </div>
        <div className="talk-reel__captions" aria-live="polite">
          <p key={captionIdx}>{caption}</p>
        </div>
        <div className="talk-reel__progress" aria-hidden>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="talk-reel__controls">
          {!playing ? (
            <button type="button" className="talk-reel__play" onClick={play}>
              ▶ Play
            </button>
          ) : (
            <button type="button" className="talk-reel__play" onClick={stop}>
              ■ Stop
            </button>
          )}
          <button type="button" className="talk-reel__mute" onClick={toggleMute} aria-pressed={muted}>
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
      <div className="talk-reel__meta">
        <h3>{reel.title}</h3>
        <p>
          {reel.publishedAt} · {Math.round(duration)}s · {reel.speakerName || speakerName}
        </p>
        <a className="btn btn-primary talk-reel__cta" href={reel.ctaHref} target="_blank" rel="noreferrer">
          {reel.cta}
        </a>
      </div>
    </article>
  );
}

export function Videos() {
  const { videos, loading } = useVideos();
  const { company } = useCms();
  const reels = useMemo(() => sortVideoReels(videos.reels), [videos.reels]);
  const today = reels[0]?.publishedAt;
  const todays = today ? reels.filter((r) => r.publishedAt === today).slice(0, 3) : [];
  const archive = today ? reels.filter((r) => r.publishedAt !== today) : reels;
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const speakerImage = videos.speakerImage || todays[0]?.speakerImage || "";

  return (
    <div className="page-shell videos-page">
      <SEO
        title="Videos | Daily Talking Reels | DisplayAvenue"
        description={
          videos.lead ||
          "Daily talking-head reels from DisplayAvenue — Google Ads, Meta, SEO, WhatsApp growth tips for Indian SMEs."
        }
        path="/videos"
        type="website"
        noindex={false}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Videos", path: "/videos" },
        ]}
      />
      <div className="container">
        <div className="page-frame videos-frame">
          <p className="badge">Videos</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            {videos.title}
          </h1>
          <p className="section-sub">{videos.lead}</p>
          <p className="videos-meta-line">
            3 reels every day · Hook · Tip · Proof
            {videos.autoPublish ? " · Autopilot on" : ""}
            {speakerImage ? " · Speaker portrait ready" : " · Upload portrait in Video Studio"}
          </p>

          {!speakerImage && (
            <div className="videos-upload-nudge" role="status">
              <strong>Add your photo to activate speaking reels.</strong>
              <span>
                Open Admin → Video Studio → upload a clear front-facing portrait. Every daily reel will use
                your image with captions and voice playback.
              </span>
            </div>
          )}

          <section className="videos-today">
            <h2>{today ? `Today · ${today}` : "Today’s reels"}</h2>
            {loading && <p className="videos-empty">Loading reels…</p>}
            {!loading && todays.length === 0 && (
              <p className="videos-empty">
                Reels publish automatically each day. Open this page again shortly, or trigger publish from
                Admin → Video Studio.
              </p>
            )}
            <div className="videos-rail">
              {todays.map((reel) => (
                <TalkingReelPlayer
                  key={reel.slug}
                  reel={reel}
                  speakerFallback={speakerImage}
                  speakerName={videos.speakerName || company.name}
                  active={activeSlug === reel.slug}
                  onActivate={() => setActiveSlug(reel.slug)}
                />
              ))}
            </div>
          </section>

          {archive.length > 0 && (
            <section className="videos-archive">
              <h2>Earlier reels</h2>
              <div className="videos-rail videos-rail--archive">
                {archive.slice(0, 24).map((reel) => (
                  <TalkingReelPlayer
                    key={reel.slug}
                    reel={reel}
                    speakerFallback={speakerImage}
                    speakerName={videos.speakerName || company.name}
                    active={activeSlug === reel.slug}
                    onActivate={() => setActiveSlug(reel.slug)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="videos-cta">
            <h2>Want reels like this for your brand?</h2>
            <p>DisplayAvenue builds daily content systems for Indian SMEs — ads, SEO, WhatsApp, and video.</p>
            <div className="videos-cta__actions">
              <a className="btn btn-primary" href={company.whatsappHref} target="_blank" rel="noreferrer">
                WhatsApp {company.whatsapp}
              </a>
              <Link className="btn btn-ghost" to="/contact">
                Book a free call
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
