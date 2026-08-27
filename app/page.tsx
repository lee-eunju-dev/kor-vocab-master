"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CreatureMascot } from "@/components/cute/creature-mascot"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { DEFAULT_CREATURE_ID } from "@/lib/creatures"
import { useSelectedCreatureId } from "@/lib/progress-storage"

export default function Home() {
  const router = useRouter()
  const creatureId = useSelectedCreatureId(DEFAULT_CREATURE_ID)

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between px-6 pt-16 pb-28 text-center">
      <SkyBackdrop scene />

      <div>
        <h1 className="text-4xl font-extrabold text-primary-foreground [-webkit-text-stroke:4px_var(--card)] [paint-order:stroke]">
          어휘 냥냥
        </h1>
        <p className="mt-2 text-xs font-bold text-muted-foreground">퀴즈 풀고 친구 모으기</p>
      </div>

      <CreatureMascot creatureId={creatureId} expression="wave" float className="size-48" />

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Button variant="cute" className="w-full text-base" onClick={() => router.push("/grades")}>
          시작하기
        </Button>
        <p className="text-[11px] text-muted-foreground">v0.1 · 학습 진행 상황은 이 기기에만 저장돼요</p>
      </div>
    </div>
  )
}
