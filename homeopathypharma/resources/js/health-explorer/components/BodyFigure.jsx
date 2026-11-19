import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FRAMES = [
  { yaw: 0, key: 'front' },
  { yaw: 90, key: 'side' },
  { yaw: 180, key: 'back' },
  { yaw: 270, key: 'side-left' },
];

/** Degrees of yaw change per pixel of horizontal drag — tuned for continuous 360 feel. */
const DRAG_DEG_PER_PX = 1.15;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN_VEL = 0.35;

function normalizeYaw(yaw) {
  const n = Number(yaw) || 0;
  return ((n % 360) + 360) % 360;
}

function angularDistance(a, b) {
  const d = Math.abs(normalizeYaw(a) - normalizeYaw(b));
  return Math.min(d, 360 - d);
}

/** Signed shortest delta from -> to in (-180, 180]. */
function signedDelta(from, to) {
  return ((normalizeYaw(to) - normalizeYaw(from) + 540) % 360) - 180;
}

function nearestFrame(yaw) {
  let best = FRAMES[0].yaw;
  let bestDist = 999;
  for (const frame of FRAMES) {
    const dist = angularDistance(yaw, frame.yaw);
    if (dist < bestDist) {
      bestDist = dist;
      best = frame.yaw;
    }
  }
  return best;
}

function frameKey(yaw) {
  const nearest = nearestFrame(yaw);
  return FRAMES.find((f) => f.yaw === nearest)?.key || 'front';
}

function viewLabel(yaw) {
  const nearest = nearestFrame(yaw);
  if (nearest === 0) return 'front';
  if (nearest === 180) return 'back';
  // Viewer-relative: yaw 90 is the view you get by turning toward YOUR left.
  if (nearest === 90) return 'left';
  return 'right';
}

function activeSpot(spot) {
  return spot && typeof spot.cx === 'number' && typeof spot.cy === 'number' ? { ...spot } : null;
}

/**
 * Tri-state: 'spot' | 'hidden' | 'missing'
 * hidden = explicitly removed for this system/view (do not fall back).
 */
function readViewEntry(spots, key) {
  if (!spots || typeof spots !== 'object' || Array.isArray(spots)) return { kind: 'missing' };
  if (Object.prototype.hasOwnProperty.call(spots, key)) {
    const value = spots[key];
    if (value === null || value === false) return { kind: 'hidden' };
    const spot = activeSpot(value);
    return spot ? { kind: 'spot', spot } : { kind: 'hidden' };
  }
  if (key === 'left' && spots.side) {
    const spot = activeSpot(spots.side);
    return spot ? { kind: 'spot', spot } : { kind: 'missing' };
  }
  if (key === 'right' && spots.side) {
    const side = activeSpot(spots.side);
    return side ? { kind: 'spot', spot: { ...side, cx: 100 - Number(side.cx) } } : { kind: 'missing' };
  }
  return { kind: 'missing' };
}

function viewKeysForYaw(yaw) {
  const nearest = nearestFrame(yaw);
  if (nearest === 0) return ['front'];
  if (nearest === 180) return ['back'];
  if (nearest === 90) return ['left'];
  if (nearest === 270) return ['right'];
  return ['front'];
}

function plainMap(value) {
  if (!value || typeof value !== 'object') return null;
  if (Array.isArray(value)) {
    const entries = Object.entries(value);
    return entries.length ? Object.fromEntries(entries) : null;
  }
  return value;
}

/**
 * Resolve hotspot for the active system filter.
 * Prefers hotspots_by_system[systemId]; falls back to shared hotspots when a view is unset.
 */
function hotspotFor(organ, gender, yaw, systemId = 'all') {
  const keys = viewKeysForYaw(yaw);
  const defaultSpots = organ.hotspots?.[gender];
  const bySystem = plainMap(organ.hotspots_by_system);
  const systemSpots = (systemId && systemId !== 'all' && systemId !== 'mental')
    ? plainMap(bySystem?.[systemId])?.[gender]
    : null;

  for (const key of keys) {
    if (systemSpots) {
      const own = readViewEntry(systemSpots, key);
      if (own.kind === 'hidden') return null;
      if (own.kind === 'spot') return own.spot;
    }
    const fallback = readViewEntry(defaultSpots, key);
    if (fallback.kind === 'spot') return fallback.spot;
  }
  return null;
}

function cacheToken() {
  if (typeof document === 'undefined') return '1';
  const fromRoot = document.getElementById('health-explorer-root')?.dataset?.cacheToken;
  if (fromRoot) return fromRoot;
  return document.querySelector('meta[name="hp-cache-token"]')?.content || '1';
}

function frameFile(gender, key) {
  // Versioned female assets so CDN/browser caches cannot keep old face/hair edits.
  if (gender === 'female') {
    if (key === 'back') return 'back-v6';
    if (key === 'front') return 'front-v2';
    if (key === 'side') return 'side-v2';
    if (key === 'side-left') return 'side-left-v2';
  }
  return key;
}

function frameSrc(gender, key) {
  return `/images/health-explorer/${gender}/${frameFile(gender, key)}.webp?v=${cacheToken()}`;
}

/** Separate system overlays sit ABOVE the silhouette; never bake into anatomy sprites. */
function systemOverlaySrc(systemId, gender, viewKey, systems = []) {
  if (!systemId || systemId === 'all') return null;
  const system = systems.find((s) => s.id === systemId);
  if (!system) return null;
  const mode = system.overlay_mode || 'none';
  if (mode === 'none') return null;
  const path = system.overlays?.[gender]?.[viewKey];
  if (!path) return null;
  const sep = String(path).includes('?') ? '&' : '?';
  return `${path}${sep}v=${cacheToken()}`;
}

function systemOverlayMode(systemId, systems = []) {
  const system = systems.find((s) => s.id === systemId);
  return system?.overlay_mode || 'none';
}

/**
 * 360° sprite turntable: one body image at a time, continuous drag with inertia,
 * hard-cuts between front / right / back / left (no opacity stacking).
 */
export default function BodyFigure({
  gender = 'female',
  yaw = 0,
  organs = [],
  activeId = null,
  zoom = 1,
  systemId = 'all',
  systems = [],
  onSelect,
  onYawChange,
}) {
  const dragRef = useRef(null);
  const yawRef = useRef(yaw);
  const inertiaRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  yawRef.current = yaw;

  const activeKey = frameKey(yaw);
  const label = viewLabel(yaw);
  const src = frameSrc(gender, activeKey);
  const overlaySrc = systemOverlaySrc(systemId, gender, activeKey, systems);
  const overlayMode = systemOverlayMode(systemId, systems);

  useEffect(() => {
    FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = frameSrc(gender, frame.key);
    });
  }, [gender]);

  useEffect(() => () => {
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
  }, []);

  const visible = useMemo(() => {
    return organs
      .map((organ) => {
        if (organ.gender !== 'both' && organ.gender !== gender) return null;
        const spot = hotspotFor(organ, gender, yaw, systemId);
        if (!spot || typeof spot.cx !== 'number' || typeof spot.cy !== 'number') return null;
        return { organ, spot };
      })
      .filter(Boolean);
  }, [organs, gender, yaw, systemId]);

  const stopInertia = useCallback(() => {
    if (inertiaRef.current) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
  }, []);

  const coastToNearest = useCallback(() => {
    stopInertia();
    const start = yawRef.current;
    const target = nearestFrame(start);
    const travel = signedDelta(start, target);
    if (Math.abs(travel) < 0.5) {
      onYawChange?.(target);
      return;
    }
    const duration = Math.min(420, 160 + Math.abs(travel) * 3.2);
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) ** 3;
      onYawChange?.(normalizeYaw(start + travel * eased));
      if (t < 1) {
        inertiaRef.current = requestAnimationFrame(step);
      } else {
        inertiaRef.current = null;
        onYawChange?.(target);
      }
    };
    inertiaRef.current = requestAnimationFrame(step);
  }, [onYawChange, stopInertia]);

  const startInertia = useCallback((velocity) => {
    stopInertia();
    let vel = velocity;
    const tick = () => {
      if (Math.abs(vel) < INERTIA_MIN_VEL) {
        coastToNearest();
        return;
      }
      const next = normalizeYaw(yawRef.current + vel);
      onYawChange?.(next);
      vel *= INERTIA_FRICTION;
      inertiaRef.current = requestAnimationFrame(tick);
    };
    inertiaRef.current = requestAnimationFrame(tick);
  }, [coastToNearest, onYawChange, stopInertia]);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    window.removeEventListener('pointermove', drag.onMove);
    window.removeEventListener('mousemove', drag.onMove);
    window.removeEventListener('pointerup', drag.onUp);
    window.removeEventListener('mouseup', drag.onUp);
    window.removeEventListener('pointercancel', drag.onUp);
    const velocity = drag.velocity || 0;
    dragRef.current = null;
    setDragging(false);
    if (Math.abs(velocity) > 1.2) {
      startInertia(velocity);
    } else {
      coastToNearest();
    }
  }, [coastToNearest, startInertia]);

  const startDrag = useCallback((clientX) => {
    endDrag();
    stopInertia();
    const onMove = (ev) => {
      if (!dragRef.current) return;
      const now = performance.now();
      const dx = ev.clientX - dragRef.current.lastX;
      const dt = Math.max(8, now - dragRef.current.lastT);
      const next = normalizeYaw(yawRef.current - dx * DRAG_DEG_PER_PX);
      // Negative dx (drag left) → positive yaw (turn right), matching natural orbit.
      dragRef.current.velocity = (-dx * DRAG_DEG_PER_PX) * (16 / dt);
      dragRef.current.lastX = ev.clientX;
      dragRef.current.lastT = now;
      onYawChange?.(next);
    };
    const onUp = () => endDrag();
    dragRef.current = {
      startX: clientX,
      lastX: clientX,
      lastT: performance.now(),
      velocity: 0,
      onMove,
      onUp,
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('pointercancel', onUp);
    setDragging(true);
  }, [endDrag, onYawChange, stopInertia]);

  const beginFromEvent = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.hx-dot')) return;
    e.preventDefault();
    startDrag(e.clientX);
  };

  return (
    <div className="hx-figure-wrap" role="group" aria-label={`${gender} anatomy, ${label} view`}>
      <div
        className={`hx-turntable${dragging ? ' is-dragging' : ''}`}
        style={{
          '--hx-zoom': zoom,
        }}
        onPointerDown={beginFromEvent}
        onMouseDown={beginFromEvent}
      >
        <div className="hx-turntable__scene">
          <img
            key={`${gender}-${activeKey}`}
            className={`hx-turntable__image is-active${overlaySrc && overlayMode === 'full_figure' ? ' is-under-system' : ''}`}
            src={src}
            alt=""
            draggable={false}
            width="420"
            height="900"
          />
          {overlaySrc ? (
            <img
              key={`overlay-${systemId}-${gender}-${activeKey}`}
              className={`hx-turntable__overlay is-active${overlayMode === 'full_figure' ? ' is-full-figure' : ''}`}
              src={overlaySrc}
              alt=""
              draggable={false}
              width="420"
              height="900"
            />
          ) : null}
          <div className={`hx-turntable__dots${dragging ? ' is-dim' : ''}`}>
            {visible.map(({ organ, spot }) => {
              const active = activeId === organ.id;
              return (
                <button
                  key={organ.id}
                  type="button"
                  className={`hx-dot${active ? ' is-active' : ''}`}
                  style={{ left: `${spot.cx}%`, top: `${spot.cy}%` }}
                  aria-label={organ.name}
                  aria-pressed={active}
                  title={organ.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(organ.id);
                  }}
                >
                  <span className="hx-dot__core" />
                  {active ? <span className="hx-dot__label">{organ.name}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="hx-sr-only">{`Interactive ${gender} anatomy, ${label} view. Drag sideways for a full 360 turn.`}</p>
    </div>
  );
}

export { normalizeYaw, nearestFrame, viewLabel, frameKey, angularDistance, signedDelta, FRAMES };
