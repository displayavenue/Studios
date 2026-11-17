import { useCallback, useMemo, useRef, useState } from 'react';

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

function frameOpacity(yaw, frameYaw) {
  const dist = angularDistance(yaw, frameYaw);
  // Soft blend across ~100° so adjacent views overlap smoothly.
  return Math.max(0, Math.min(1, 1 - dist / 100));
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

/**
 * Smooth image turntable: stacked frames crossfade by yaw while dragging.
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
  const label = viewLabel(yaw);
  yawRef.current = yaw;

  const layers = useMemo(
    () => FRAMES.map((frame) => ({
      ...frame,
      opacity: frameOpacity(yaw, frame.yaw),
      src: `/images/health-explorer/${gender}/${frame.key}.webp`,
    })),
    [gender, yaw],
  );

  const visible = useMemo(() => {
    const opacity = frameOpacity(yaw, nearestFrame(yaw));
    if (opacity < 0.35) return [];
    return organs
      .map((organ) => {
        if (organ.gender !== 'both' && organ.gender !== gender) return null;
        const spot = hotspotFor(organ, gender, yaw);
        if (!spot || typeof spot.cx !== 'number' || typeof spot.cy !== 'number') return null;
        return { organ, spot, opacity };
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
  }, []);

  const startDrag = useCallback((clientX) => {
    endDrag();
    const onMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      // Continuous turn — no snapping while dragging.
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
        style={{ '--hx-zoom': zoom }}
        onPointerDown={beginFromEvent}
        onMouseDown={beginFromEvent}
      >
        <div className="hx-turntable__scene">
          {layers.map((layer) => (
            <img
              key={layer.key}
              className="hx-turntable__image"
              src={layer.src}
              alt=""
              draggable={false}
              width="420"
              height="900"
              style={{ opacity: layer.opacity }}
            />
          ))}
          <div className="hx-turntable__dots">
            {visible.map(({ organ, spot, opacity }) => {
              const active = activeId === organ.id;
              return (
                <button
                  key={organ.id}
                  type="button"
                  className={`hx-dot${active ? ' is-active' : ''}`}
                  style={{ left: `${spot.cx}%`, top: `${spot.cy}%`, opacity }}
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
      <p className="hx-sr-only">{`Interactive ${gender} anatomy, ${label} view. Drag sideways to turn smoothly.`}</p>
    </div>
  );
}

export { normalizeYaw, nearestFrame, viewLabel, frameKey, angularDistance };
