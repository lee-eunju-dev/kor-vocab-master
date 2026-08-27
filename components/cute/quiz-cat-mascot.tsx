"use client"

import { useCallback } from "react"
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react"

import { cn } from "@/lib/utils"

type ReactionState = "idle" | "correct" | "wrong"

// LottieFiles 무료 고양이 애니메이션(Lottie Simple License, 상업적 사용/임베드 가능, 출처 표기 불필요).
// https://lottiefiles.com/free-animation/loader-cat-dWUie0iIVk 외 관련 애니메이션에서 확보한 실제 .lottie 파일 URL.
const LOTTIE_SRC: Record<ReactionState, string> = {
  idle: "https://assets-v2.lottiefiles.com/a/83627cee-1153-11ee-b832-fb1242dd7de9/sSzsHHquis.lottie",
  correct: "https://assets-v2.lottiefiles.com/a/5a40df34-117d-11ee-a1af-5fe2367006a3/F4fhuEz6xB.lottie",
  wrong: "https://assets-v2.lottiefiles.com/a/5a3ef944-117d-11ee-a1ad-3f2ca2b1255d/S2CWfDgwd3.lottie",
}

interface QuizCatMascotProps {
  reaction?: ReactionState
  className?: string
  onReactionEnd?: () => void
}

function QuizCatMascot({ reaction = "idle", className, onReactionEnd }: QuizCatMascotProps) {
  const isIdle = reaction === "idle"

  const refCallback = useCallback(
    (dotLottie: DotLottie | null) => {
      if (!dotLottie || isIdle || !onReactionEnd) return
      const handleComplete = () => onReactionEnd()
      dotLottie.addEventListener("complete", handleComplete)
      return () => dotLottie.removeEventListener("complete", handleComplete)
    },
    [isIdle, onReactionEnd]
  )

  return (
    <div className={cn("relative", className)}>
      <DotLottieReact
        key={reaction}
        src={LOTTIE_SRC[reaction]}
        loop={isIdle}
        autoplay
        dotLottieRefCallback={refCallback}
        className="h-full w-full"
      />
    </div>
  )
}

export { QuizCatMascot }
export type { ReactionState }
