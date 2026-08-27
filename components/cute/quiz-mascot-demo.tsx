"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { QuizCatMascot, type ReactionState } from "@/components/cute/quiz-cat-mascot"

// 정답/오답 클릭 시 Lottie 상태가 바뀌는 것을 보여주는 데모. 실제 퀴즈 화면에서는
// 보기를 고르는 순간 setReaction("correct" | "wrong")을 호출하면 된다.
function QuizMascotDemo() {
  const [reaction, setReaction] = useState<ReactionState>("idle")

  return (
    <div className="flex flex-col items-center gap-2">
      <QuizCatMascot reaction={reaction} onReactionEnd={() => setReaction("idle")} className="size-20" />
      <div className="flex gap-2">
        <Button
          variant="cuteMint"
          size="sm"
          className="h-7 px-2.5 text-[11px]"
          onClick={() => setReaction("correct")}
        >
          정답 반응
        </Button>
        <Button variant="cute" size="sm" className="h-7 px-2.5 text-[11px]" onClick={() => setReaction("wrong")}>
          오답 반응
        </Button>
      </div>
    </div>
  )
}

export { QuizMascotDemo }
