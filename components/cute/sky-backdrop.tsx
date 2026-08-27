"use client"

import { cn } from "@/lib/utils"

// docs/ref-image/ref-image01.jpg의 장면 배경을 기준으로 그린 하늘·언덕 배경.
// 예전에는 SVG 하나를 preserveAspectRatio="none"으로 늘려서 구름이 찌그러졌는데,
// 하늘(CSS 그라데이션) / 구름 / 지면 풍경을 분리해 비율이 유지되도록 했다.
interface SkyBackdropProps {
  className?: string
  /** 화면 아래에 잔디 언덕을 깐다. */
  ground?: boolean
  /** 먼 산·나무까지 있는 풍경을 화면 아래에 깐다 (타이틀 화면용). */
  scene?: boolean
  /** 지평선을 위로 올려 초록 벌판이 화면 대부분을 채운다 (Stage 지도용). */
  field?: boolean
}

const CLOUDS = [
  { left: "4%", top: "6%", size: "5.5rem", opacity: 0.95 },
  { left: "62%", top: "14%", size: "7rem", opacity: 0.9 },
  { left: "14%", top: "34%", size: "6rem", opacity: 0.75 },
  { left: "70%", top: "46%", size: "5rem", opacity: 0.7 },
]

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 32" className={className} style={style} aria-hidden>
      <path
        d="M14 30 C6 30 2 24 8 20 C6 12 18 8 23 14 C28 5 43 8 42 17 C51 15 55 25 48 30 Z"
        fill="var(--card)"
      />
    </svg>
  )
}

function Mountains() {
  return (
    <g>
      <path d="M-10 46 L26 14 L48 34 L70 12 L104 46 Z" fill="var(--stone)" />
      <path d="M96 46 L130 16 L152 36 L172 20 L206 46 Z" fill="var(--stone-deep)" opacity="0.75" />
      <path d="M26 14 L34 22 L30 24 L22 22 Z" fill="var(--card)" />
      <path d="M70 12 L78 21 L73 23 L63 21 Z" fill="var(--card)" />
      <path d="M130 16 L138 25 L133 27 L123 25 Z" fill="var(--card)" />
    </g>
  )
}

const TREES = [
  { x: 30, s: 0.95 },
  { x: 58, s: 0.75 },
  { x: 88, s: 0.85 },
  { x: 124, s: 0.7 },
  { x: 152, s: 1 },
  { x: 178, s: 0.8 },
]

function Trees({ y, scale = 1 }: { y: number; scale?: number }) {
  return (
    <g>
      {TREES.map((tree) => (
        <g key={tree.x} transform={`translate(${tree.x} ${y}) scale(${tree.s * scale})`}>
          <rect x="-1.6" y="-4" width="3.2" height="8" rx="1.4" fill="#B98157" />
          <path
            d="M0 -18 C7 -12 8 -6 5 -3 L-5 -3 C-8 -6 -7 -12 0 -18 Z"
            fill="var(--grass-deep)"
            stroke="var(--ink)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </g>
  )
}

function SkyBackdrop({ className, ground = false, scene = false, field = false }: SkyBackdropProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      {/* 하늘 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-top via-sky-mid to-background" />

      {/* 구름 */}
      {CLOUDS.map((cloud, i) => (
        <Cloud
          key={i}
          className="absolute h-auto"
          style={{ left: cloud.left, top: cloud.top, width: cloud.size, opacity: cloud.opacity }}
        />
      ))}

      {/* 벌판형 — 지평선을 위로 올리고 아래를 통째로 잔디로 채운다.
          Stage 지도가 하늘에 떠 보이지 않도록 하기 위한 배치다. */}
      {field && (
        <>
          <div className="absolute inset-x-0 bottom-0 bg-grass" style={{ top: "21%" }} />
          <svg
            viewBox="0 0 200 52"
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-x-0 w-full"
            style={{ top: "3%", height: "20%" }}
          >
            <Mountains />
            <path
              d="M-10 44 C24 36 52 48 84 42 C114 36 142 48 174 41 C190 38 202 42 210 40 L210 54 L-10 54 Z"
              fill="var(--grass)"
            />
            <Trees y={46} scale={0.6} />
          </svg>
        </>
      )}

      {/* 지면 풍경 — 아래쪽에 붙이고 비율을 유지한 채 잘라낸다 */}
      {(ground || scene) && (
        <svg
          viewBox="0 0 200 70"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-[26%] w-full"
        >
          {scene && <Mountains />}

          {/* 뒤쪽 언덕 */}
          <path
            d="M-10 50 C20 40 44 52 70 46 C96 40 122 52 150 46 C176 41 194 48 210 44 L210 72 L-10 72 Z"
            fill="var(--grass)"
            opacity="0.85"
          />

          {scene && <Trees y={48} scale={0.7} />}

          {/* 앞쪽 잔디 */}
          <path
            d="M-10 58 C24 50 52 62 84 56 C114 50 142 62 174 55 C190 52 202 56 210 54 L210 72 L-10 72 Z"
            fill="var(--grass-deep)"
          />
        </svg>
      )}
    </div>
  )
}

export { SkyBackdrop }
