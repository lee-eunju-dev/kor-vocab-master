"use client"

import { useRouter } from "next/navigation"
import { PawPrint, Settings, ShoppingBag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreatureMascot } from "@/components/cute/creature-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { CHAPTERS } from "@/data/vocab-stages"
import { DEFAULT_CREATURE_ID } from "@/lib/creatures"
import { GRADE_LABEL, type Grade } from "@/lib/quiz-types"
import { chapterProgress, useProgress, useSelectedCreatureId } from "@/lib/progress-storage"

const GRADE_ORDER: Grade[] = ["elementary", "middle", "high"]

// 학년 카드도 대표 동물로 통일한다. 학년마다 표정만 다르게 줘서 구분한다.
const GRADE_EXPRESSION: Record<Grade, "wink" | "happy" | "crown"> = {
  elementary: "wink",
  middle: "happy",
  high: "crown",
}

export default function GradeListPage() {
  const router = useRouter()
  const progress = useProgress()
  const creatureId = useSelectedCreatureId(DEFAULT_CREATURE_ID)

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop scene />

      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold">어떤 어휘를 풀까요?</h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <PawPrint className="size-3.5" />내 츄 {progress.points}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full border-2 border-border bg-card/90"
              onClick={() => router.push("/collection")}
              aria-label="상점·도감"
            >
              <ShoppingBag className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full border-2 border-border bg-card/90"
              onClick={() => router.push("/settings")}
              aria-label="설정"
            >
              <Settings className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {GRADE_ORDER.map((grade) => {
            const chapters = CHAPTERS.filter((chapter) => chapter.grade === grade)
            if (chapters.length === 0) return null

            const stages = chapters.flatMap((chapter) => chapter.stages)
            const stats = chapterProgress(progress, stages)
            const percent = stats.totalStages === 0 ? 0 : (stats.clearedStages / stats.totalStages) * 100

            return (
              <button
                key={grade}
                type="button"
                onClick={() => router.push(`/grades/${grade}`)}
                className="text-left transition-transform active:scale-[0.98]"
                aria-label={`${GRADE_LABEL[grade]}, 단원 ${chapters.length}개, ${stats.clearedStages}/${stats.totalStages} Stage 클리어`}
              >
                <CuteCard className="flex items-center gap-4 p-5">
                  <CreatureMascot
                    creatureId={creatureId}
                    expression={GRADE_EXPRESSION[grade]}
                    className="size-16 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-extrabold">{GRADE_LABEL[grade]}</p>
                    <p className="text-xs font-bold text-muted-foreground">단원 {chapters.length}개</p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-border bg-muted">
                        <div
                          className="h-full rounded-full bg-secondary transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[11px] font-bold text-muted-foreground">
                        {stats.clearedStages}/{stats.totalStages}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                      <Star className="size-3 fill-primary text-primary-foreground/40" />
                      {stats.stars} / {stats.maxStars}
                    </p>
                  </div>
                </CuteCard>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
