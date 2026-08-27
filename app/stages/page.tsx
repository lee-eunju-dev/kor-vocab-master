"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { StageIsland, type IslandState } from "@/components/cute/stage-island"
import { cn } from "@/lib/utils"
import { STAGES } from "@/data/vocab-stages"
import { isStageUnlocked, useProgress } from "@/lib/progress-storage"

export default function StageListPage() {
  const router = useRouter()
  const progress = useProgress()
  const [lockedStageId, setLockedStageId] = useState<number | null>(null)

  const handleSelect = (stageId: number) => {
    if (isStageUnlocked(progress, stageId)) {
      router.push(`/stages/${stageId}`)
    } else {
      setLockedStageId(stageId)
    }
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-6 pb-6">
      <SkyBackdrop ground />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold">Stage 목록</h1>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full bg-card/80"
            onClick={() => router.push("/settings")}
            aria-label="설정"
          >
            <Settings className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col-reverse gap-9 pb-2">
          {STAGES.map((stage, i) => {
            const record = progress.stagesCleared[stage.id]
            const unlocked = isStageUnlocked(progress, stage.id)
            const state: IslandState = record?.cleared ? "cleared" : unlocked ? "current" : "locked"

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleSelect(stage.id)}
                className={cn("self-start", i % 2 === 1 && "self-end")}
                aria-label={`Stage ${stage.id}${record?.cleared ? ` 클리어, 별 ${record.stars}개` : unlocked ? " 플레이 가능" : " 잠김"}`}
              >
                <StageIsland n={stage.id} state={state} stars={record?.stars ?? 0} />
              </button>
            )
          })}
        </div>
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
