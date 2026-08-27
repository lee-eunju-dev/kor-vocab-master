"use client"

import { useId } from "react"
import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { StarRating } from "@/components/cute/star-rating"

type IslandState = "cleared" | "current" | "locked"

interface StageIslandProps extends React.ComponentProps<"div"> {
  n: number
  state: IslandState
  stars?: number
}

function StageIsland({ n, state, stars = 0, className, ...props }: StageIslandProps) {
  const uid = useId()
  const gradId = `island-${uid}`
  const locked = state === "locked"
  const current = state === "current"

  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      {/* 지금 풀 수 있는 Stage에는 "여기부터!" 말풍선을 띄운다 */}
      <div className="h-6">
        {current && (
          <span className="animate-cute-float rounded-full border-2 border-primary-foreground/20 bg-primary px-2.5 py-0.5 text-[10px] font-extrabold text-primary-foreground shadow-chunky-xs">
            여기부터!
          </span>
        )}
      </div>

      {/* 잔디 언덕 — 번호 배지가 서 있는 발판 */}
      <svg viewBox="0 0 72 38" className="mt-1 h-11 w-[72px] drop-shadow-[0_4px_0_var(--ink-shadow)]">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={locked ? "var(--stone)" : "var(--grass)"} />
            <stop offset="100%" stopColor={locked ? "var(--stone-deep)" : "var(--grass-deep)"} />
          </linearGradient>
        </defs>
        <path
          d="M4 28 C2 15 15 6 36 6 C57 6 70 15 68 28 C68 34 55 37 36 37 C17 37 4 34 4 28 Z"
          fill={`url(#${gradId})`}
          stroke="var(--ink)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>

      {/* 번호 배지 — 이 컴포넌트에서 실제로 읽어야 할 정보(몇 번 Stage인지)는 이것 하나뿐이라,
          가장 크고 진하게 그려서 눈에 먼저 들어오게 한다. 언덕과 겹치는 부분을 줄여서
          (이전엔 절반 가까이 언덕에 파묻혀 있었다) 숫자가 잘리거나 묻혀 보이지 않게 했다.
          벌판·언덕 색과 상관없이 도드라지도록 테두리는 다른 요소와 같은 굵은 잉크색을 쓰고,
          상태 구분은 테두리색이 아니라 채움색으로 한다. */}
      <div
        className={cn(
          "-mt-5 flex size-14 items-center justify-center rounded-full border-4 border-[var(--ink)] bg-card text-xl font-extrabold shadow-chunky-sm",
          current && "scale-110 bg-primary text-primary-foreground",
          state === "cleared" && "bg-secondary text-secondary-foreground",
          locked && "bg-muted-foreground/70 text-background"
        )}
      >
        {locked ? <Lock className="size-5" /> : n}
      </div>

      <div className="mt-1.5 h-4">
        {state === "cleared" && <StarRating count={stars} className="scale-[0.55]" />}
      </div>
    </div>
  )
}

export { StageIsland }
export type { IslandState }
