"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { resetProgress } from "@/lib/progress-storage"

export default function SettingsPage() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [justReset, setJustReset] = useState(false)

  function handleReset() {
    resetProgress()
    setConfirming(false)
    setJustReset(true)
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-6 pb-6">
      <SkyBackdrop />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full bg-card/80"
            onClick={() => router.push("/stages")}
            aria-label="뒤로가기"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h1 className="text-base font-extrabold">설정</h1>
        </div>

        <CuteCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
            <RotateCcw className="size-4" /> 데이터
          </div>
          <p className="text-xs text-muted-foreground">클리어 기록과 츄 포인트가 이 기기에서 모두 사라져요.</p>
          <Button
            variant="outline"
            className="w-full rounded-full border-destructive/40 text-destructive"
            onClick={() => setConfirming(true)}
          >
            진행 상황 초기화
          </Button>
          {justReset && <p className="text-xs font-bold text-secondary-foreground">초기화됐어요.</p>}
        </CuteCard>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-foreground/35 px-8"
          onClick={() => setConfirming(false)}
        >
          <CuteCard
            className="flex w-full max-w-xs flex-col items-center gap-2 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CatMascot expression="sad" tone="gray" className="size-24" />
            <p className="text-base font-extrabold">정말 초기화할까요?</p>
            <p className="-mt-1 text-xs text-muted-foreground">클리어 기록과 츄 포인트를 되돌릴 수 없어요.</p>
            <div className="mt-1 flex w-full flex-col gap-2">
              <Button variant="outline" className="w-full border-destructive/40 text-destructive" onClick={handleReset}>
                초기화
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setConfirming(false)}>
                취소
              </Button>
            </div>
          </CuteCard>
        </div>
      )}
    </div>
  )
}
