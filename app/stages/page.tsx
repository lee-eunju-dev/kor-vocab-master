"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, PawPrint, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { StageIsland, type IslandState } from "@/components/cute/stage-island"
import { StageTrail, trailLayout } from "@/components/cute/stage-trail"
import { STAGES } from "@/data/vocab-stages"
import { isStageUnlocked, useProgress } from "@/lib/progress-storage"

export default function StageListPage() {
  const router = useRouter()
  const progress = useProgress()
  const [lockedStageId, setLockedStageId] = useState<number | null>(null)

  const { width, height, points } = trailLayout(STAGES.length)

  const handleSelect = (stageId: number) => {
    if (isStageUnlocked(progress, stageId)) {
      router.push(`/stages/${stageId}`)
    } else {
      setLockedStageId(stageId)
    }
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop field />

      {/* 상단 바 — 모은 츄와 설정 */}
      <div className="mx-auto mb-2 flex w-full max-w-md items-center justify-between">
        <h1 className="text-lg font-extrabold">스테이지</h1>
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

      {/* 오솔길 지도 */}
      <div className="relative mx-auto" style={{ width, height }}>
        <StageTrail points={points} width={width} height={height} />

        {STAGES.map((stage, i) => {
          const record = progress.stagesCleared[stage.id]
          const unlocked = isStageUnlocked(progress, stage.id)
          const state: IslandState = record?.cleared ? "cleared" : unlocked ? "current" : "locked"
          const point = points[i]

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleSelect(stage.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-95"
              style={{ left: point.x, top: point.y }}
              aria-label={`Stage ${stage.id}${
                record?.cleared ? ` 클리어, 별 ${record.stars}개` : unlocked ? " 플레이 가능" : " 잠김"
              }`}
            >
              <StageIsland n={stage.id} state={state} stars={record?.stars ?? 0} />
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
            <p className="-mt-1 text-xs text-muted-foreground">
              Stage {lockedStageId - 1}을 먼저 클리어하면 열려요
            </p>
            <Button variant="cute" className="mt-1 w-full" onClick={() => setLockedStageId(null)}>
              확인
            </Button>
          </CuteCard>
        </div>
      )}
    </div>
  )
}
