"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Lock, PawPrint } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreatureMascot } from "@/components/cute/creature-mascot"
import { CuteCard } from "@/components/cute/cute-card"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { cn } from "@/lib/utils"
import { CREATURES, DEFAULT_CREATURE_ID } from "@/lib/creatures"
import {
  isCreatureOwned,
  purchaseCreature,
  selectCreature,
  useProgress,
} from "@/lib/progress-storage"

type Tab = "shop" | "dex"

// 목록이 길어져도 한 화면 안에서 스크롤 없이 훑을 수 있도록 페이지 단위로 나눈다
// (app/grades/[grade]/page.tsx의 단원 목록 페이지네이션과 같은 방식).
const SHOP_PER_PAGE = 4
const DEX_PER_PAGE = 9

export default function CollectionPage() {
  const router = useRouter()
  const progress = useProgress()
  const [tab, setTab] = useState<Tab>("shop")
  const [shopPage, setShopPage] = useState(0)
  const [dexPage, setDexPage] = useState(0)
  const [detailId, setDetailId] = useState<string | null>(null)

  const selectedId = progress.selectedCreature ?? DEFAULT_CREATURE_ID
  const detail = detailId ? CREATURES.find((c) => c.id === detailId) : null
  const detailOwned = detail ? isCreatureOwned(progress, detail.id, DEFAULT_CREATURE_ID) : false

  const shopPageCount = Math.max(1, Math.ceil(CREATURES.length / SHOP_PER_PAGE))
  const currentShopPage = Math.min(shopPage, shopPageCount - 1)
  const pagedShopCreatures = CREATURES.slice(
    currentShopPage * SHOP_PER_PAGE,
    currentShopPage * SHOP_PER_PAGE + SHOP_PER_PAGE
  )

  const dexPageCount = Math.max(1, Math.ceil(CREATURES.length / DEX_PER_PAGE))
  const currentDexPage = Math.min(dexPage, dexPageCount - 1)
  const pagedDexCreatures = CREATURES.slice(
    currentDexPage * DEX_PER_PAGE,
    currentDexPage * DEX_PER_PAGE + DEX_PER_PAGE
  )

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-5 pb-8">
      <SkyBackdrop scene />

      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full border-2 border-border bg-card/90"
              onClick={() => router.back()}
              aria-label="뒤로"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-lg font-extrabold">상점·도감</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <PawPrint className="size-3.5" />내 츄 {progress.points}
          </span>
        </div>

        <div className="mb-4 flex gap-2 rounded-full border-4 border-border bg-card p-1">
          {(
            [
              ["shop", "상점"],
              ["dex", "도감"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-extrabold transition-colors",
                tab === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "shop" ? (
          <>
            <div className="flex flex-col gap-3">
              {pagedShopCreatures.map((creature) => {
                const owned = isCreatureOwned(progress, creature.id, DEFAULT_CREATURE_ID)
                const affordable = progress.points >= creature.price

                return (
                  <CuteCard key={creature.id} className="flex items-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => setDetailId(creature.id)}
                      className="shrink-0 transition-transform active:scale-95"
                      aria-label={`${creature.name} 자세히 보기`}
                    >
                      <CreatureMascot creatureId={creature.id} expression="happy" className="size-14" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold">{creature.name}</p>
                      <p className="text-xs font-bold text-muted-foreground">
                        {creature.price === 0 ? "기본 캐릭터" : `${creature.price} 츄`}
                      </p>
                    </div>

                    {owned ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-border bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
                        <Check className="size-3.5" />
                        보유 중
                      </span>
                    ) : (
                      <Button
                        variant="cute"
                        size="sm"
                        disabled={!affordable}
                        onClick={() => purchaseCreature(creature.id, creature.price)}
                      >
                        구매
                      </Button>
                    )}
                  </CuteCard>
                )
              })}
            </div>

            {shopPageCount > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full border-2 border-border bg-card/90"
                  disabled={currentShopPage === 0}
                  onClick={() => setShopPage((p) => Math.max(0, p - 1))}
                  aria-label="이전 상점 페이지"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs font-bold text-muted-foreground">
                  {currentShopPage + 1} / {shopPageCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full border-2 border-border bg-card/90"
                  disabled={currentShopPage === shopPageCount - 1}
                  onClick={() => setShopPage((p) => Math.min(shopPageCount - 1, p + 1))}
                  aria-label="다음 상점 페이지"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {pagedDexCreatures.map((creature) => {
                const owned = isCreatureOwned(progress, creature.id, DEFAULT_CREATURE_ID)
                const isSelected = owned && creature.id === selectedId

                return (
                  <button
                    key={creature.id}
                    type="button"
                    onClick={() => setDetailId(creature.id)}
                    aria-label={owned ? `${creature.name} 자세히 보기` : "아직 잠긴 캐릭터"}
                  >
                    <CuteCard
                      className={cn(
                        "flex flex-col items-center gap-1 p-3",
                        isSelected && "border-primary bg-accent"
                      )}
                    >
                      {owned ? (
                        <CreatureMascot creatureId={creature.id} expression="happy" className="size-12" />
                      ) : (
                        <div className="relative flex size-12 items-center justify-center">
                          <CreatureMascot
                            creatureId={creature.id}
                            expression="neutral"
                            className="size-12 opacity-25 brightness-0"
                          />
                          <Lock className="absolute size-4 text-muted-foreground" />
                        </div>
                      )}
                      <p className="w-full truncate text-center text-[11px] font-bold">
                        {owned ? creature.name : "???"}
                      </p>
                      {isSelected && <p className="text-[10px] font-bold text-primary">대표</p>}
                    </CuteCard>
                  </button>
                )
              })}
            </div>

            {dexPageCount > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full border-2 border-border bg-card/90"
                  disabled={currentDexPage === 0}
                  onClick={() => setDexPage((p) => Math.max(0, p - 1))}
                  aria-label="이전 도감 페이지"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs font-bold text-muted-foreground">
                  {currentDexPage + 1} / {dexPageCount}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full border-2 border-border bg-card/90"
                  disabled={currentDexPage === dexPageCount - 1}
                  onClick={() => setDexPage((p) => Math.min(dexPageCount - 1, p + 1))}
                  aria-label="다음 도감 페이지"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          onClick={() => setDetailId(null)}
        >
          <CuteCard
            className="flex w-full max-w-xs flex-col items-center gap-3 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {detailOwned ? (
              <CreatureMascot creatureId={detail.id} expression="cheer" className="size-28" />
            ) : (
              <div className="relative flex size-28 items-center justify-center">
                <CreatureMascot
                  creatureId={detail.id}
                  expression="neutral"
                  className="size-28 opacity-25 brightness-0"
                />
                <Lock className="absolute size-8 text-muted-foreground" />
              </div>
            )}

            <p className="text-lg font-extrabold">{detailOwned ? detail.name : "아직 못 만난 친구"}</p>
            <p className="text-xs font-bold text-muted-foreground">
              {detailOwned
                ? detail.price === 0
                  ? "기본 캐릭터"
                  : `${detail.price} 츄로 구매함`
                : `상점에서 ${detail.price} 츄로 구매할 수 있어요`}
            </p>

            {detailOwned && detail.id !== selectedId && (
              <Button
                variant="cute"
                className="w-full"
                onClick={() => {
                  selectCreature(detail.id, DEFAULT_CREATURE_ID)
                  setDetailId(null)
                }}
              >
                대표로 정하기
              </Button>
            )}

            <Button variant="ghost" className="w-full" onClick={() => setDetailId(null)}>
              닫기
            </Button>
          </CuteCard>
        </div>
      )}
    </div>
  )
}
