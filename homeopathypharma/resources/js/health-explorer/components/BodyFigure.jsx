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
  if (nearest === 90) return 'right';
  return 'left';
}

function hotspotFor(organ, gender, yaw) {
  const spots = organ.hotspots?.[gender];
  if (!spots) return null;
  const nearest = nearestFrame(yaw);
  if (nearest === 0 && spots.front) return { ...spots.front };
  if (nearest === 180 && spots.back) return { ...spots.back };
  if (nearest === 90 && (spots.side || spots.front)) {
    return { ...(spots.side || spots.front) };
  }
  if (nearest === 270) {
    const src = spots.side || spots.front;
    if (!src) return null;
    return { ...src, cx: 100 - Number(src.cx) };
  }
  return spots.front || spots.back || null;
}

function frameSrc(gender, key) {
  return `/images/health-explorer/${gender}/${key}.webp`;
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
  onSelect,
  onYawChange,
}) {
  const dragRef = useRef(null);
  const yawRef = useRef(yaw);
  const inertiaRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  yawRef.current = yaw;

  const nearest = nearestFrame(yaw);
  const activeKey = frameKey(yaw);
  const label = viewLabel(yaw);
  const residual = signedDelta(nearest, yaw);
  const slideX = Math.max(-18, Math.min(18, residual * 0.28));
  const src = frameSrc(gender, activeKey);

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
        const spot = hotspotFor(organ, gender, yaw);
        if (!spot || typeof spot.cx !== 'number' || typeof spot.cy !== 'number') return null;
        return { organ, spot };
      })
      .filter(Boolean);
  }, [organs, gender, yaw]);

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
          '--hx-slide': `${slideX}px`,
        }}
        onPointerDown={beginFromEvent}
        onMouseDown={beginFromEvent}
      >
        <div className="hx-turntable__scene">
          <img
            key={`${gender}-${activeKey}`}
            className="hx-turntable__image is-active"
            src={src}
            alt=""
            draggable={false}
            width="420"
            height="900"
          />
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
