"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Lock, PawPrint } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { StageIsland, type IslandState } from "@/components/cute/stage-island"
import { StageTrail, trailLayout } from "@/components/cute/stage-trail"
import { getChapter } from "@/data/vocab-stages"
import { GRADE_LABEL } from "@/lib/quiz-types"
import { isStageUnlocked, useProgress } from "@/lib/progress-storage"

export default function ChapterTrailPage() {
  const params = useParams<{ chapterId: string }>()
  return <ChapterTrailView key={params.chapterId} chapterId={Number(params.chapterId)} />
}

function ChapterTrailView({ chapterId }: { chapterId: number }) {
  const router = useRouter()
  const progress = useProgress()
  const [lockedStageId, setLockedStageId] = useState<number | null>(null)

  const chapter = getChapter(chapterId)

  if (!chapter) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-extrabold">존재하지 않는 단원이에요</p>
        <Button variant="cute" onClick={() => router.push("/grades")}>
          등급 선택으로
        </Button>
      </div>
    )
  }

  const { width, height, points } = trailLayout(chapter.stages.length)

  const handleSelect = (stageId: number, prevStageId: number | null) => {
    if (isStageUnlocked(progress, prevStageId)) {
      router.push(`/stages/${stageId}`)
    } else {
      setLockedStageId(stageId)
    }
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop field />

      {/* 상단 바 — 어느 단원인지 항상 보이게 둔다 */}
      <div className="mx-auto mb-2 flex w-full max-w-md items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full border-2 border-border bg-card/90"
          onClick={() => router.push(`/grades/${chapter.grade}`)}
          aria-label="단원 목록으로"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-muted-foreground">{GRADE_LABEL[chapter.grade]}</p>
          <h1 className="truncate text-base font-extrabold">{chapter.title}</h1>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          <PawPrint className="size-3.5" />
          {progress.points}
        </span>
      </div>

      {/* 오솔길 지도 */}
      <div className="relative mx-auto" style={{ width, height }}>
        <StageTrail points={points} width={width} height={height} />

        {chapter.stages.map((stage, i) => {
          const record = progress.stagesCleared[stage.id]
          const unlocked = isStageUnlocked(progress, stage.prevStageId)
          const state: IslandState = record?.cleared ? "cleared" : unlocked ? "current" : "locked"
          const point = points[i]

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleSelect(stage.id, stage.prevStageId)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95"
              style={{ left: point.x, top: point.y }}
              aria-label={`Stage ${stage.id}${
                record?.cleared ? ` 클리어, 별 ${record.stars}개` : unlocked ? " 플레이 가능" : " 잠김"
              }`}
            >
              {/* 챕터 안에서는 1부터 세는 순번을 보여준다 (전체 번호는 너무 커진다) */}
              <StageIsland n={i + 1} state={state} stars={record?.stars ?? 0} />
            </button>
          )
        })}

        {/* 길 끝에서 응원하는 고양이 */}
        <CatMascot
          expression="wave"
          float
          className="absolute size-20"
          style={{ left: points[0].x + 96, top: points[0].y - 30 }}
        />
      </div>

      {lockedStageId !== null && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-foreground/35 px-8"
          onClick={() => setLockedStageId(null)}
        >
          <CuteCard
            className="flex w-full max-w-xs flex-col items-center gap-2 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Lock className="size-5" />
            </div>
            <p className="text-base font-extrabold">아직 잠겨 있어요</p>
            <p className="-mt-1 text-xs text-muted-foreground">앞 Stage를 먼저 클리어하면 열려요</p>
            <Button variant="cute" className="mt-1 w-full" onClick={() => setLockedStageId(null)}>
              확인
            </Button>
          </CuteCard>
        </div>
      )}
    </div>
  )
}
