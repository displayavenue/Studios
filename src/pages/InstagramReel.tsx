import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import { sendableTrendReel } from "../data/reels/sendableTrend";
import "./Page.css";
import "./InstagramReel.css";

export function InstagramReel() {
  const reel = sendableTrendReel;
  const [beatIndex, setBeatIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [toast, setToast] = useState("");
  const timerRef = useRef<number | null>(null);
  const beat = reel.beats[beatIndex];
  const beatDurationMs = (beat.endSec - beat.startSec) * 1000;

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setBeatIndex((i) => (i + 1) % reel.beats.length);
    }, beatDurationMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [beatIndex, playing, beatDurationMs, reel.beats.length]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const copyText = async (label: string, value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setToast(`${label} copied`);
    } catch {
      setToast("Could not copy — select the text manually");
    }
  };

  const voiceoverScript = reel.beats
    .map((b) => `[${b.startSec}–${b.endSec}s] ${b.voiceover}`)
    .join("\n\n");

  return (
    <div className="reel-page">
      <SEO
        title={`${reel.title} | Instagram Reel | DisplayAvenue Studios`}
        description="DisplayAvenue Studios Instagram Reel explaining the 2026 sendable-content trend — DM shares beat likes, context-first storytelling, and shareable brand formats."
        path={`/reel/${reel.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Instagram Reel", path: `/reel/${reel.slug}` },
        ]}
      />

      <section className="reel-page__hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Instagram Reel</span>
          </nav>
          <p className="eyebrow">Instagram Reel · {reel.account}</p>
          <h1>{reel.title}</h1>
          <p className="reel-page__lede">
            A ready-to-post Reel for DisplayAvenue explaining the biggest 2026
            social shift: sendable content. Built from patterns winning on
            trending Reels — DM shares over likes, context first, product second.
          </p>
        </div>
      </section>

      <section className="container reel-stage">
        <div>
          <div className="reel-phone" aria-label="Vertical Instagram Reel preview">
            <div className="reel-phone__notch" aria-hidden />
            <div className="reel-phone__frame">
              {reel.beats.map((scene, i) => (
                <div
                  key={scene.id}
                  className={`reel-scene${i === beatIndex ? " is-active" : ""}`}
                  aria-hidden={i !== beatIndex}
                >
                  <div className="reel-scene__media">
                    <img src={scene.image} alt="" />
                    <div className="reel-scene__shade" />
                  </div>
                  <div className="reel-scene__copy">
                    <p className="reel-scene__brand">DisplayAvenue Studios</p>
                    <p className="reel-scene__text">{scene.onScreen}</p>
                    <p className="reel-scene__meta">
                      {scene.startSec}s–{scene.endSec}s · {reel.trendName}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reel-phone__ui" aria-hidden>
              <div className="reel-phone__progress">
                {reel.beats.map((scene, i) => (
                  <span
                    key={scene.id}
                    className={
                      i < beatIndex
                        ? "is-done"
                        : i === beatIndex && playing
                          ? "is-active"
                          : i === beatIndex
                            ? "is-done"
                            : ""
                    }
                  >
                    <i
                      style={
                        i === beatIndex && playing
                          ? { animationDuration: `${beatDurationMs}ms` }
                          : undefined
                      }
                    />
                  </span>
                ))}
              </div>
              <div className="reel-phone__handle">{reel.account}</div>
              <div className="reel-phone__actions">
                <div>
                  <b>♥</b>
                  Like
                </div>
                <div>
                  <b>↗</b>
                  Send
                </div>
                <div>
                  <b>○</b>
                  Save
                </div>
              </div>
            </div>
          </div>

          <div className="reel-controls">
            <button
              type="button"
              className="btn btn--gold"
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause reel" : "Play reel"}
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                setBeatIndex(0);
                setPlaying(true);
              }}
            >
              Restart
            </button>
            <Link to="/services/social-media-reels" className="btn btn--outline">
              Book Reels
            </Link>
          </div>
        </div>

        <div className="reel-kit">
          <h2>Posting kit</h2>
          <p className="reel-kit__intro">
            {reel.sourcesNote} Duration ~{reel.durationSec}s · {reel.aspectRatio}.{" "}
            {reel.musicNote}.
          </p>

          <div className="reel-kit__grid">
            <div className="reel-panel">
              <h3>Beat timeline</h3>
              <div className="reel-beats">
                {reel.beats.map((scene, i) => (
                  <button
                    key={scene.id}
                    type="button"
                    className={`reel-beat${i === beatIndex ? " is-current" : ""}`}
                    onClick={() => {
                      setBeatIndex(i);
                      setPlaying(false);
                    }}
                  >
                    <span className="reel-beat__time">
                      {scene.startSec}–{scene.endSec}s
                    </span>
                    <span>
                      <span className="reel-beat__title">{scene.onScreen}</span>
                      <p className="reel-beat__vo">{scene.voiceover}</p>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="reel-panel">
              <h3>Caption</h3>
              <pre className="reel-caption">{reel.caption}</pre>
              <div className="reel-panel__actions">
                <button
                  type="button"
                  className="btn btn--gold"
                  onClick={() => copyText("Caption", reel.caption)}
                >
                  Copy caption
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => copyText("Voiceover", voiceoverScript)}
                >
                  Copy voiceover
                </button>
              </div>
            </div>

            <div className="reel-panel">
              <h3>Shot list</h3>
              <ol>
                {reel.shotList.map((shot) => (
                  <li key={shot}>{shot}</li>
                ))}
              </ol>
            </div>

            <div className="reel-panel">
              <h3>Hashtags</h3>
              <div className="reel-tags">
                {reel.hashtags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="reel-panel__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => copyText("Hashtags", reel.hashtags.join(" "))}
                >
                  Copy hashtags
                </button>
              </div>
            </div>

            <div className="reel-panel">
              <h3>Posting tips</h3>
              <ul>
                {reel.postingTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className={`reel-toast${toast ? " is-on" : ""}`} role="status">
        {toast}
      </div>
    </div>
  );
}
