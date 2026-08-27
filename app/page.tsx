"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"

export default function Home() {
  const router = useRouter()

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between px-6 pt-16 pb-10 text-center">
      <SkyBackdrop ground />

      <div>
        <h1 className="text-3xl font-extrabold text-primary-foreground [-webkit-text-stroke:3px_var(--card)] [paint-order:stroke]">
          어휘 냥냥
        </h1>
        <p className="mt-2 text-xs font-bold text-muted-foreground">퀴즈 풀고 냥이 모으기</p>
      </div>

      <CatMascot expression="happy" float className="size-32" />

      <div className="flex w-full max-w-xs flex-col items-center gap-3">
        <Button variant="cute" className="w-full text-base" onClick={() => router.push("/stages")}>
          시작하기
        </Button>
        <p className="text-[11px] text-muted-foreground">v0.1 · 학습 진행 상황은 이 기기에만 저장돼요</p>
      </div>
    </div>
  )
}
