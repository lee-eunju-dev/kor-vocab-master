"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Lock, PawPrint, Settings, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreatureMascot } from "@/components/cute/creature-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { cn } from "@/lib/utils"
import { CHAPTERS } from "@/data/vocab-stages"
import { DEFAULT_CREATURE_ID } from "@/lib/creatures"
import { GRADE_LABEL, type Grade } from "@/lib/quiz-types"
import { chapterProgress, useProgress, useSelectedCreatureId } from "@/lib/progress-storage"

function isGrade(value: string): value is Grade {
  return value === "elementary" || value === "middle" || value === "high"
}

// 챕터가 늘어나도 한 화면에서 다 스크롤하지 않도록 페이지 단위로 나눠 보여준다.
const CHAPTERS_PER_PAGE = 3

export default function GradeChapterListPage() {
  const params = useParams<{ grade: string }>()
  // grade가 바뀌면 페이지 번호를 1페이지로 되돌리기 위해 key로 강제 리마운트한다.
  return <GradeChapterListView key={params.grade} gradeParam={params.grade} />
}

function GradeChapterListView({ gradeParam }: { gradeParam: string }) {
  const router = useRouter()
  const progress = useProgress()
  const creatureId = useSelectedCreatureId(DEFAULT_CREATURE_ID)
  const [page, setPage] = useState(0)

  if (!isGrade(gradeParam)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-extrabold">존재하지 않는 등급이에요</p>
        <Button variant="cute" onClick={() => router.push("/grades")}>
          등급 선택으로
        </Button>
      </div>
    )
  }

  const grade = gradeParam
  const chapters = CHAPTERS.filter((chapter) => chapter.grade === grade)
  const pageCount = Math.max(1, Math.ceil(chapters.length / CHAPTERS_PER_PAGE))
  const currentPage = Math.min(page, pageCount - 1)
  const pagedChapters = chapters.slice(
    currentPage * CHAPTERS_PER_PAGE,
    currentPage * CHAPTERS_PER_PAGE + CHAPTERS_PER_PAGE
  )

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop scene />

      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full border-2 border-border bg-card/90"
            onClick={() => router.push("/grades")}
            aria-label="등급 선택으로"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-extrabold">{GRADE_LABEL[grade]}</h1>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <PawPrint className="size-3.5" />
            {progress.points}
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

        {chapters.length === 0 ? (
          <CuteCard className="p-6 text-center text-sm text-muted-foreground">
            아직 준비된 단원이 없어요.
          </CuteCard>
        ) : (
          <div className="flex flex-col gap-3">
            {pagedChapters.map((chapter) => {
              const stats = chapterProgress(progress, chapter.stages)
              const percent = stats.totalStages === 0 ? 0 : (stats.clearedStages / stats.totalStages) * 100
              // chapter.id는 등급을 넘나드는 전역 고유 번호(초등 19~27 등)라 그대로
              // 보여주면 사용자에게 이상해 보인다. 그 등급 안에서 몇 번째 단원인지로 보여준다.
              const orderInGrade = chapters.indexOf(chapter) + 1

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
                        orderInGrade
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
        )}

        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full border-2 border-border bg-card/90"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="이전 단원"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-xs font-bold text-muted-foreground">
              {currentPage + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full border-2 border-border bg-card/90"
              disabled={currentPage === pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              aria-label="다음 단원"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-center pt-6">
          <CreatureMascot creatureId={creatureId} expression="wave" float className="size-24" />
        </div>
      </div>
    </div>
  )
}
