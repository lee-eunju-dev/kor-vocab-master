"use client"

import { useRouter } from "next/navigation"
import { Check, Lock, PawPrint, Settings, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { cn } from "@/lib/utils"
import { CHAPTERS } from "@/data/vocab-stages"
import { GRADE_LABEL, type Grade } from "@/lib/quiz-types"
import { chapterProgress, useProgress } from "@/lib/progress-storage"

const GRADE_ORDER: Grade[] = ["middle", "high"]

export default function ChapterListPage() {
  const router = useRouter()
  const progress = useProgress()

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop scene />

      <div className="mx-auto w-full max-w-md">
        {/* 상단 바 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold">단원 고르기</h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              <PawPrint className="size-3.5" />내 츄 {progress.points}
            </span>
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

        {GRADE_ORDER.map((grade) => {
          const chapters = CHAPTERS.filter((chapter) => chapter.grade === grade)
          if (chapters.length === 0) return null

          return (
            <section key={grade} className="mb-6">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {GRADE_LABEL[grade]}
              </h2>

              <div className="flex flex-col gap-3">
                {chapters.map((chapter) => {
                  const stageIds = chapter.stages.map((stage) => stage.id)
                  const stats = chapterProgress(progress, stageIds)
                  const percent =
                    stats.totalStages === 0 ? 0 : (stats.clearedStages / stats.totalStages) * 100

                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      disabled={!stats.unlocked}
                      onClick={() => router.push(`/chapters/${chapter.id}`)}
                      className="text-left transition-transform active:scale-[0.98] disabled:active:scale-100"
                      aria-label={`${chapter.title} 단원, ${
                        stats.unlocked
                          ? `Stage ${stats.clearedStages}/${stats.totalStages} 클리어, 별 ${stats.stars}개`
                          : "잠김"
                      }`}
                    >
                      <CuteCard className={cn("flex items-center gap-3 p-4", !stats.unlocked && "opacity-55")}>
                        {/* 단원 번호 / 상태 */}
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-full border-4 bg-card text-base font-extrabold",
                            stats.done && "border-secondary text-secondary-foreground",
                            !stats.done && stats.unlocked && "border-primary text-primary-foreground",
                            !stats.unlocked && "border-muted-foreground/40 text-muted-foreground"
                          )}
                        >
                          {!stats.unlocked ? (
                            <Lock className="size-4" />
                          ) : stats.done ? (
                            <Check className="size-5" />
                          ) : (
                            chapter.id
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-extrabold">{chapter.title}</p>

                          <div className="mt-1.5 flex items-center gap-2">
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
            </section>
          )
        })}

        <div className="flex justify-center pt-2">
          <CatMascot expression="wave" float className="size-24" />
        </div>
      </div>
    </div>
  )
}
