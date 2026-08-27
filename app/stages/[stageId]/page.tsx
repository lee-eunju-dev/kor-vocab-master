"use client"

import { useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronLeft, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot, type CatTone } from "@/components/cute/cat-mascot"
import { ChuBadge } from "@/components/cute/chu-badge"
import { CuteCard } from "@/components/cute/cute-card"
import { QuizCatMascot, type ReactionState } from "@/components/cute/quiz-cat-mascot"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { SpeechBubble } from "@/components/cute/speech-bubble"
import { StarRating } from "@/components/cute/star-rating"
import { cn } from "@/lib/utils"
import { getStage, STAGES } from "@/data/vocab-stages"
import { recordStageResult, type StageResult } from "@/lib/progress-storage"

type Phase = "playing" | "feedback" | "result"

const CHOICE_TONES: CatTone[] = ["orange", "white", "gray", "orange"]

function resultCopy(stars: number): string {
  if (stars >= 3) return "참 잘했어요!"
  if (stars === 2) return "잘했어요!"
  return "수고했어요!"
}

export default function StagePlayPage() {
  const params = useParams<{ stageId: string }>()
  // Next.js는 같은 [stageId] 라우트끼리 이동할 때 컴포넌트를 재사용하고 params만 바꾼다.
  // key를 stageId로 고정해 Stage가 바뀔 때마다 아래 컴포넌트를 강제로 새로 마운트해서
  // 이전 Stage의 진행 상태(phase, questionIndex, result 등)가 남지 않게 한다.
  return <StagePlayView key={params.stageId} stageId={Number(params.stageId)} />
}

function StagePlayView({ stageId }: { stageId: number }) {
  const router = useRouter()
  const stage = getStage(stageId)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [phase, setPhase] = useState<Phase>("playing")
  const [paused, setPaused] = useState(false)
  const [result, setResult] = useState<StageResult | null>(null)
  const recordedRef = useRef(false)

  if (!stage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-extrabold">존재하지 않는 Stage예요</p>
        <Button variant="cute" onClick={() => router.push("/stages")}>
          Stage 목록으로
        </Button>
      </div>
    )
  }

  const question = stage.questions[questionIndex]
  const isCorrect = selectedChoice !== null && selectedChoice === question.answerIndex
  const isLastQuestion = questionIndex === stage.questions.length - 1
  const reaction: ReactionState = phase === "feedback" ? (isCorrect ? "correct" : "wrong") : "idle"

  function resetRun() {
    setQuestionIndex(0)
    setSelectedChoice(null)
    setCorrectCount(0)
    setResult(null)
    recordedRef.current = false
    setPhase("playing")
  }

  function handleChoose(choiceIndex: number) {
    if (phase !== "playing") return
    setSelectedChoice(choiceIndex)
    if (choiceIndex === question.answerIndex) {
      setCorrectCount((c) => c + 1)
    }
    setPhase("feedback")
  }

  function handleNext() {
    if (isLastQuestion) {
      if (!recordedRef.current) {
        recordedRef.current = true
        setResult(recordStageResult(stageId, correctCount))
      }
      setPhase("result")
    } else {
      setQuestionIndex((i) => i + 1)
      setSelectedChoice(null)
      setPhase("playing")
    }
  }

  const hasNextStage = STAGES.some((s) => s.id === stageId + 1)

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-6 pb-6">
      <SkyBackdrop />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {phase !== "result" && (
          <div className={cn("flex flex-1 flex-col", phase === "feedback" && "opacity-40")}>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${(questionIndex / stage.questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {questionIndex + 1}/{stage.questions.length}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full bg-card/80"
                onClick={() => setPaused(true)}
                aria-label="일시정지"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            <div className="mb-3 flex justify-center">
              <QuizCatMascot reaction={reaction} className="size-20" />
            </div>

            <SpeechBubble className="mb-5">
              <p className="text-base font-bold">{question.question}</p>
            </SpeechBubble>

            <div className="flex flex-col gap-2.5">
              {question.choices.map((choice, i) => {
                const isSelected = selectedChoice === i
                const isAnswer = i === question.answerIndex
                const showAsCorrect = phase === "feedback" && isAnswer
                const showAsWrong = phase === "feedback" && isSelected && !isAnswer

                return (
                  <Button
                    key={choice}
                    type="button"
                    variant="cute"
                    disabled={phase === "feedback"}
                    onClick={() => handleChoose(i)}
                    className={cn(
                      "h-auto justify-start gap-2.5 px-3 py-2.5 text-left text-xs whitespace-normal",
                      showAsCorrect && "ring-4 ring-secondary-foreground/30",
                      showAsWrong && "ring-4 ring-destructive/40"
                    )}
                  >
                    <CatMascot
                      expression={showAsCorrect ? "wink" : "neutral"}
                      tone={CHOICE_TONES[i]}
                      className="size-8 shrink-0"
                    />
                    {choice}
                    {showAsCorrect && <Check className="ml-auto size-4 shrink-0" />}
                    {showAsWrong && <X className="ml-auto size-4 shrink-0 text-destructive" />}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {phase === "feedback" && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-foreground/35 px-6">
            <CuteCard className="flex w-full max-w-xs flex-col items-center gap-2 text-center">
              <CatMascot
                expression={isCorrect ? "wink" : "neutral"}
                tone={isCorrect ? "orange" : "gray"}
                className="size-16"
              />
              <p className={cn("text-lg font-extrabold", isCorrect && "text-secondary-foreground")}>
                {isCorrect ? "정답이에요!" : "괜찮아요, 다음엔 맞힐 거예요!"}
              </p>
              <p className="-mt-1 text-xs text-muted-foreground">{question.explanation}</p>
              <Button variant="cuteMint" className="mt-1 w-full" onClick={handleNext}>
                다음 문제
              </Button>
            </CuteCard>
          </div>
        )}

        {phase === "result" && result && (
          <div className="relative flex flex-1 items-center justify-center px-2">
            <CuteCard className="flex w-full max-w-xs flex-col items-center gap-3 text-center">
              <CatMascot expression={result.stars >= 3 ? "crown" : "happy"} float className="size-28" />
              <p className="text-xl font-extrabold">{resultCopy(result.stars)}</p>
              <StarRating count={result.stars} />
              {result.isFirstClear ? (
                <ChuBadge amount={result.pointsEarned} />
              ) : (
                <p className="rounded-full border-4 border-muted bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">
                  포인트는 처음 클리어할 때만 받아요
                </p>
              )}
              <div className="flex w-full flex-col gap-2">
                {hasNextStage && (
                  <Button variant="cute" className="w-full" onClick={() => router.push(`/stages/${stageId + 1}`)}>
                    다음 Stage
                  </Button>
                )}
                <Button variant="cuteMint" className="w-full" onClick={resetRun}>
                  다시 도전!
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.push("/stages")}>
                  Stage 목록으로
                </Button>
              </div>
            </CuteCard>
          </div>
        )}

        {paused && phase !== "result" && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-foreground/35 px-6">
            <CuteCard className="flex w-full max-w-xs flex-col items-center gap-3 text-center">
              <CatMascot expression="neutral" className="size-16" />
              <p className="text-lg font-extrabold">잠깐 쉴까요?</p>
              <p className="-mt-2 text-xs text-muted-foreground">지금 나가면 이 Stage는 처음부터 다시 풀어야 해요</p>
              <div className="flex w-full flex-col gap-2">
                <Button variant="cute" className="w-full" onClick={() => setPaused(false)}>
                  이어하기
                </Button>
                <Button
                  variant="cuteMint"
                  className="w-full"
                  onClick={() => {
                    resetRun()
                    setPaused(false)
                  }}
                >
                  처음부터 다시
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => router.push("/stages")}
                >
                  Stage 목록으로 나가기
                </Button>
              </div>
            </CuteCard>
          </div>
        )}
      </div>
    </div>
  )
}
