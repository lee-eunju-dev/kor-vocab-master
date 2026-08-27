"use client"

import { cn } from "@/lib/utils"

// docs/ref-image/ref-image01.jpg의 스테이지 선택 화면처럼, Stage들을 구불구불한
// 오솔길로 이어 준다. Stage 수가 늘어도 아래로 계속 길어지도록 픽셀 간격 기준으로
// 배치한다 (어휘 데이터가 늘면 Stage도 계속 늘어난다).
const TRAIL_WIDTH = 320
const STEP = 118
const BOTTOM_PADDING = 56
const TOP_PADDING = 40
const NODE_X = [78, 232]

export interface TrailPoint {
  x: number
  y: number
}

export function trailLayout(count: number) {
  const height = (count - 1) * STEP + BOTTOM_PADDING + TOP_PADDING
  const points: TrailPoint[] = Array.from({ length: count }, (_, i) => ({
    x: NODE_X[i % 2],
    y: height - BOTTOM_PADDING - i * STEP,
  }))
  return { width: TRAIL_WIDTH, height, points }
}

function trailPath(points: TrailPoint[]): string {
  if (points.length === 0) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1]
    const to = points[i]
    const bend = (from.y - to.y) * 0.55
    d += ` C ${from.x} ${from.y - bend}, ${to.x} ${to.y + bend}, ${to.x} ${to.y}`
  }
  return d
}

interface StageTrailProps {
  points: TrailPoint[]
  width: number
  height: number
  className?: string
}

/** Stage 노드들을 잇는 흙길. 노드 버튼은 이 위에 따로 얹는다. */
function StageTrail({ points, width, height, className }: StageTrailProps) {
  const d = trailPath(points)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {/* 길 테두리 → 흙 → 가운데 점선 순서로 겹쳐 그린다 */}
      <path d={d} stroke="var(--ink)" strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.16" />
      <path d={d} stroke="#D9B287" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d={d} stroke="#EBCFAB" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path
        d={d}
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="8 12"
        opacity="0.65"
      />
    </svg>
  )
}

export { StageTrail }
