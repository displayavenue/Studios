import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const FRAMES = [
  { yaw: 0, key: 'front' },
  { yaw: 90, key: 'side' },
  { yaw: 180, key: 'back' },
  { yaw: 270, key: 'side-left' },
];

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
 * Single-frame turntable: exactly one body image on screen.
 * Drag updates yaw; the nearest cardinal view hard-cuts in (no opacity blend,
 * no CSS rotateY foreshortening — both caused a double/ghost look on these arts).
 * A small translateX tracks drag residual so the turn still feels continuous.
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
  const [dragging, setDragging] = useState(false);
  yawRef.current = yaw;

  const nearest = nearestFrame(yaw);
  const activeKey = frameKey(yaw);
  const label = viewLabel(yaw);
  const residual = signedDelta(nearest, yaw);
  // Subtle lateral nudge while dragging between cardinals — not a second silhouette.
  const slideX = Math.max(-14, Math.min(14, residual * 0.32));
  const src = frameSrc(gender, activeKey);

  // Prefetch sibling views so hard-cuts stay instant.
  useEffect(() => {
    FRAMES.forEach((frame) => {
      const img = new Image();
      img.src = frameSrc(gender, frame.key);
    });
  }, [gender]);

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

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    window.removeEventListener('pointermove', drag.onMove);
    window.removeEventListener('mousemove', drag.onMove);
    window.removeEventListener('pointerup', drag.onUp);
    window.removeEventListener('mouseup', drag.onUp);
    window.removeEventListener('pointercancel', drag.onUp);
    dragRef.current = null;
    setDragging(false);
    onYawChange?.(nearestFrame(yawRef.current));
  }, [onYawChange]);

  const startDrag = useCallback((clientX) => {
    endDrag();
    const onMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const next = normalizeYaw(dragRef.current.startYaw - dx * 0.85);
      onYawChange?.(next);
    };
    const onUp = () => endDrag();
    dragRef.current = {
      startX: clientX,
      startYaw: normalizeYaw(yawRef.current),
      onMove,
      onUp,
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('pointercancel', onUp);
    setDragging(true);
  }, [endDrag, onYawChange]);

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
          <div className="hx-turntable__dots">
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
      <p className="hx-sr-only">{`Interactive ${gender} anatomy, ${label} view. Drag sideways to turn.`}</p>
    </div>
  );
}

export { normalizeYaw, nearestFrame, viewLabel, frameKey, angularDistance, signedDelta };
