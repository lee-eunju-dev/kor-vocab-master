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

      {/* 잔디 언덕 */}
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

      {/* 번호 배지 — 언덕 색에 묻히지 않도록 밝은 바탕에 색 테두리를 쓴다 */}
      <div
        className={cn(
          "-mt-6 flex size-12 items-center justify-center rounded-full border-4 bg-card text-lg font-extrabold shadow-chunky-sm",
          current && "scale-110 border-primary text-primary-foreground",
          state === "cleared" && "border-secondary text-secondary-foreground",
          locked && "border-muted-foreground/40 text-muted-foreground"
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
