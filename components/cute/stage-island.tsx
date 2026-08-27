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

  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <svg viewBox="0 0 64 34" className="h-9 w-16 drop-shadow-[0_3px_0_rgba(59,42,42,0.15)]">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={locked ? "#E2DCE8" : "#CDEBB0"} />
            <stop offset="100%" stopColor={locked ? "#C4BCD1" : "#9FCB7F"} />
          </linearGradient>
        </defs>
        <path
          d="M4 26 C2 14 14 6 32 6 C50 6 62 14 60 26 C60 31 48 33 32 33 C16 33 4 31 4 26 Z"
          fill={`url(#${gradId})`}
          stroke="#3B2A2A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className={cn(
          "-mt-5 flex size-9 items-center justify-center rounded-full border-4 font-extrabold",
          state === "current" && "border-primary-foreground/25 bg-primary text-primary-foreground",
          state === "cleared" && "border-secondary-foreground/25 bg-secondary text-secondary-foreground",
          locked && "border-foreground/15 bg-muted-foreground/75 text-background"
        )}
      >
        {locked ? <Lock className="size-4" /> : n}
      </div>

      <div className="mt-1 h-3">{state === "cleared" && <StarRating count={stars} className="scale-[0.5]" />}</div>
    </div>
  )
}

export { StageIsland }
export type { IslandState }
