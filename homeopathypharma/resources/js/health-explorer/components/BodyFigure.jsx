/**
 * Stylized anatomical body figure with gender + view variants and organ hotspots.
 * Hotspot coordinates are percentages of the 100×160 viewBox.
 */
export default function BodyFigure({
  gender = 'female',
  view = 'front',
  organs = [],
  activeId = null,
  zoom = 1,
  onSelect,
}) {
  const visible = organs.filter((organ) => {
    if (organ.gender !== 'both' && organ.gender !== gender) return false;
    const spot = organ.hotspots?.[gender]?.[view];
    return spot && typeof spot.cx === 'number';
  });

  return (
    <div className="hx-figure-wrap" role="group" aria-label={`${gender} body ${view} view`}>
      <svg
        className="hx-figure"
        viewBox="0 0 100 160"
        style={{ transform: `scale(${zoom})` }}
        role="img"
        aria-label={`Interactive ${gender} anatomy, ${view} view`}
      >
        <title>{`${gender} anatomy ${view}`}</title>
        {view === 'front' ? <FrontSilhouette gender={gender} /> : <BackSilhouette gender={gender} />}

        {visible.map((organ) => {
          const spot = organ.hotspots[gender][view];
          const active = activeId === organ.id;
          return (
            <g key={organ.id}>
              <circle
                className={`hx-hotspot${active ? ' is-active' : ''}`}
                cx={spot.cx}
                cy={spot.cy}
                r={spot.r || 3}
                tabIndex={0}
                role="button"
                aria-label={organ.name}
                aria-pressed={active}
                onClick={() => onSelect?.(organ.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(organ.id);
                  }
                }}
              />
              <text
                x={spot.cx}
                y={spot.cy - (spot.r || 3) - 1.8}
                textAnchor="middle"
                fontSize="2.6"
                fill="#0a4f44"
                fontWeight="700"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {active ? organ.name : ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FrontSilhouette({ gender }) {
  const hips = gender === 'female' ? 28 : 24;
  const chest = gender === 'female' ? 20 : 22;
  const waist = gender === 'female' ? 17 : 18;
  return (
    <g>
      {/* head */}
      <ellipse className="hx-body-fill" cx="50" cy="12" rx="8.5" ry="10" />
      {/* neck */}
      <rect className="hx-body-accent" x="46.5" y="20" width="7" height="6" rx="2" />
      {/* torso */}
      <path
        className="hx-body-fill"
        d={`M ${50 - chest} 28
            C ${50 - chest - 2} 40, ${50 - waist} 48, ${50 - hips} 58
            L ${50 - hips + 2} 72
            L ${50 + hips - 2} 72
            L ${50 + hips} 58
            C ${50 + waist} 48, ${50 + chest + 2} 40, ${50 + chest} 28
            Z`}
      />
      {/* arms */}
      <path className="hx-body-fill" d="M28 30 C18 38, 14 52, 16 68 C18 70, 22 68, 23 64 C22 52, 26 40, 32 34 Z" />
      <path className="hx-body-fill" d="M72 30 C82 38, 86 52, 84 68 C82 70, 78 68, 77 64 C78 52, 74 40, 68 34 Z" />
      {/* legs */}
      <path className="hx-body-fill" d="M36 72 C34 95, 33 120, 35 148 C38 150, 42 148, 43 144 C42 120, 44 95, 46 72 Z" />
      <path className="hx-body-fill" d="M64 72 C66 95, 67 120, 65 148 C62 150, 58 148, 57 144 C58 120, 56 95, 54 72 Z" />
      {/* midline cue */}
      <path d="M50 30 V70" stroke="#9ec2b6" strokeWidth="0.6" strokeDasharray="1.5 1.5" fill="none" />
    </g>
  );
}

function BackSilhouette({ gender }) {
  const hips = gender === 'female' ? 28 : 24;
  const chest = gender === 'female' ? 20 : 22;
  return (
    <g>
      <ellipse className="hx-body-fill" cx="50" cy="12" rx="8.5" ry="10" />
      <rect className="hx-body-accent" x="46.5" y="20" width="7" height="6" rx="2" />
      <path
        className="hx-body-fill"
        d={`M ${50 - chest} 28
            C ${50 - chest - 1} 42, ${50 - hips + 2} 52, ${50 - hips} 58
            L ${50 - hips + 2} 72
            L ${50 + hips - 2} 72
            L ${50 + hips} 58
            C ${50 + hips - 2} 52, ${50 + chest + 1} 42, ${50 + chest} 28
            Z`}
      />
      <path className="hx-body-fill" d="M28 30 C18 38, 14 52, 16 68 C18 70, 22 68, 23 64 C22 52, 26 40, 32 34 Z" />
      <path className="hx-body-fill" d="M72 30 C82 38, 86 52, 84 68 C82 70, 78 68, 77 64 C78 52, 74 40, 68 34 Z" />
      <path className="hx-body-fill" d="M36 72 C34 95, 33 120, 35 148 C38 150, 42 148, 43 144 C42 120, 44 95, 46 72 Z" />
      <path className="hx-body-fill" d="M64 72 C66 95, 67 120, 65 148 C62 150, 58 148, 57 144 C58 120, 56 95, 54 72 Z" />
      {/* spine cue */}
      <path d="M50 26 V72" stroke="#6f9e90" strokeWidth="1.2" fill="none" />
      {[34, 42, 50, 58, 66].map((y) => (
        <circle key={y} cx="50" cy={y} r="1.1" fill="#6f9e90" />
      ))}
    </g>
  );
}
