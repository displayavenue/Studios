import { useCallback, useMemo, useRef, useState } from 'react';

const FRAME_YAWS = [0, 90, 180, 270];

function normalizeYaw(yaw) {
  const n = Number(yaw) || 0;
  return ((n % 360) + 360) % 360;
}

function nearestFrame(yaw) {
  const y = normalizeYaw(yaw);
  let best = FRAME_YAWS[0];
  let bestDist = 999;
  for (const candidate of FRAME_YAWS) {
    const dist = Math.min(Math.abs(y - candidate), 360 - Math.abs(y - candidate));
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

function frameKey(yaw) {
  const nearest = nearestFrame(yaw);
  if (nearest === 0) return 'front';
  if (nearest === 180) return 'back';
  if (nearest === 90) return 'side';
  return 'side-left';
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
  if (nearest === 0 && spots.front) return { ...spots.front, flipX: false };
  if (nearest === 180 && spots.back) return { ...spots.back, flipX: false };
  if (nearest === 90 && (spots.side || spots.front)) {
    return { ...(spots.side || spots.front), flipX: false };
  }
  if (nearest === 270) {
    const src = spots.side || spots.front;
    if (!src) return null;
    return { ...src, cx: 100 - Number(src.cx), flipX: true };
  }
  return spots.front || spots.back || null;
}

/**
 * Image-based anatomy turntable with small red organ dots.
 * Drag horizontally or use rotate controls to turn left/right.
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
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const frame = frameKey(yaw);
  const label = viewLabel(yaw);
  const src = `/images/health-explorer/${gender}/${frame}.webp`;

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

  const startDrag = useCallback((clientX) => {
    dragRef.current = { startX: clientX, startYaw: normalizeYaw(yaw) };
    setDragging(true);
  }, [yaw]);

  const moveDrag = useCallback((clientX) => {
    if (!dragRef.current) return;
    const dx = clientX - dragRef.current.startX;
    // Drag right → turn left (see body's left side), natural turntable feel.
    const next = normalizeYaw(dragRef.current.startYaw - dx * 0.45);
    onYawChange?.(next);
  }, [onYawChange]);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
    // Snap to nearest cardinal view for clearer organ mapping.
    onYawChange?.(nearestFrame(yaw));
  }, [onYawChange, yaw]);

  return (
    <div className="hx-figure-wrap" role="group" aria-label={`${gender} anatomy, ${label} view`}>
      <div
        ref={stageRef}
        className={`hx-turntable${dragging ? ' is-dragging' : ''}`}
        style={{ '--hx-zoom': zoom, '--hx-yaw': `${((normalizeYaw(yaw) + 180) % 360) - 180}deg` }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          if (e.target.closest('.hx-dot')) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          startDrag(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          moveDrag(e.clientX);
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="hx-turntable__scene" aria-hidden={false}>
          <img
            className="hx-turntable__image"
            src={src}
            alt=""
            draggable={false}
            width="420"
            height="900"
          />
          <div className="hx-turntable__dots" aria-hidden={false}>
            {visible.map(({ organ, spot }) => {
              const active = activeId === organ.id;
              const left = `${spot.cx}%`;
              const top = `${spot.cy}%`;
              return (
                <button
                  key={organ.id}
                  type="button"
                  className={`hx-dot${active ? ' is-active' : ''}`}
                  style={{ left, top }}
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
      <p className="hx-sr-only">{`Interactive ${gender} anatomy, ${label} view. Drag sideways or use rotate buttons to turn.`}</p>
    </div>
  );
}

export { normalizeYaw, nearestFrame, viewLabel, frameKey };
