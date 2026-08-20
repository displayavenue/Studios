import { SIGNS_EN, SIGNS_HI } from '../astrology/constants'
import type { KundaliChart, Language } from '../astrology/types'

const HOUSE_POS: Record<number, { x: number; y: number }> = {
  1: { x: 50, y: 28 },
  2: { x: 28, y: 18 },
  3: { x: 18, y: 28 },
  4: { x: 28, y: 50 },
  5: { x: 18, y: 72 },
  6: { x: 28, y: 82 },
  7: { x: 50, y: 72 },
  8: { x: 72, y: 82 },
  9: { x: 82, y: 72 },
  10: { x: 72, y: 50 },
  11: { x: 82, y: 28 },
  12: { x: 72, y: 18 },
}

const SHORT: Record<string, string> = {
  sun: 'Su',
  moon: 'Mo',
  mars: 'Ma',
  mercury: 'Me',
  jupiter: 'Ju',
  venus: 'Ve',
  saturn: 'Sa',
  rahu: 'Ra',
  ketu: 'Ke',
}

export function ChartNorthIndian({
  chart,
  lang,
}: {
  chart: KundaliChart
  lang: Language
}) {
  const byHouse: Record<number, string[]> = {}
  for (let h = 1; h <= 12; h++) byHouse[h] = []
  for (const p of chart.planets) {
    byHouse[p.house].push(`${SHORT[p.id] ?? p.id}${p.isRetrograde ? 'ᴿ' : ''}`)
  }

  return (
    <div className="north-chart" aria-label="North Indian style chart">
      <svg viewBox="0 0 100 100" role="img">
        <rect x="2" y="2" width="96" height="96" fill="#fffaf2" stroke="#5c1a1a" strokeWidth="1.2" />
        <line x1="2" y1="2" x2="98" y2="98" stroke="#5c1a1a" strokeWidth="0.8" />
        <line x1="98" y1="2" x2="2" y2="98" stroke="#5c1a1a" strokeWidth="0.8" />
        <line x1="50" y1="2" x2="2" y2="50" stroke="#5c1a1a" strokeWidth="0.8" />
        <line x1="2" y1="50" x2="50" y2="98" stroke="#5c1a1a" strokeWidth="0.8" />
        <line x1="50" y1="98" x2="98" y2="50" stroke="#5c1a1a" strokeWidth="0.8" />
        <line x1="98" y1="50" x2="50" y2="2" stroke="#5c1a1a" strokeWidth="0.8" />

        {Array.from({ length: 12 }, (_, i) => {
          const house = i + 1
          const signIdx = chart.houses[i]
          const pos = HOUSE_POS[house]
          const sign = lang === 'hi' ? SIGNS_HI[signIdx] : SIGNS_EN[signIdx].slice(0, 3)
          const planets = byHouse[house].join(' ')
          return (
            <g key={house}>
              <text
                x={pos.x}
                y={pos.y - 3}
                textAnchor="middle"
                fontSize="3.2"
                fill="#7a6358"
                fontFamily="DM Sans, sans-serif"
              >
                {sign}
              </text>
              <text
                x={pos.x}
                y={pos.y + 2.5}
                textAnchor="middle"
                fontSize="3.6"
                fill="#5c1a1a"
                fontWeight="600"
                fontFamily="DM Sans, sans-serif"
              >
                {planets || '·'}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
