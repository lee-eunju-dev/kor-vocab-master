"use client"

import { useSyncExternalStore } from "react"

export interface StageRecord {
  cleared: boolean
  stars: number
}

export interface Progress {
  stagesCleared: Record<number, StageRecord>
  points: number
  /** 구매한 동물 캐릭터 id 목록 (lib/creatures.ts의 CreatureDef.id). 기본 오렌지
   *  고양이(DEFAULT_CREATURE_ID)는 여기 없어도 항상 보유한 것으로 취급한다. */
  ownedCreatures: string[]
  /** 앱 전체 마스코트로 쓰는 대표 캐릭터. null이면 기본 오렌지 고양이. */
  selectedCreature: string | null
}

export interface StageResult {
  stars: number
  pointsEarned: number
  isFirstClear: boolean
  totalPoints: number
}

// v8: 동물 도감·상점(docs/specs/creature-collection/spec.md)에서 구매 목록과
// 대표 캐릭터 선택을 저장하기 위해 필드를 추가했다.
const STORAGE_KEY = "kor-vocab-master:progress:v8"
const EMPTY_PROGRESS: Progress = {
  stagesCleared: {},
  points: 0,
  ownedCreatures: [],
  selectedCreature: null,
}

// loadProgress()가 매번 새 객체를 만들면 useSyncExternalStore가 값이 바뀐 줄 알고
// 계속 리렌더링을 일으킨다. 그래서 localStorage에 실제로 쓸 때만 캐시를 갱신한다.
let cache: Progress | null = null
const listeners = new Set<() => void>()

function readFromStorage(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      stagesCleared: parsed.stagesCleared ?? {},
      points: parsed.points ?? 0,
      ownedCreatures: parsed.ownedCreatures ?? [],
      selectedCreature: parsed.selectedCreature ?? null,
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function loadProgress(): Progress {
  if (!cache) cache = readFromStorage()
  return cache
}

function saveProgress(progress: Progress): void {
  cache = progress
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getServerSnapshot(): Progress {
  return EMPTY_PROGRESS
}

/** 진행 상황(Stage 클리어·별점·포인트)을 읽고, 변경되면 자동으로 리렌더링되는 훅. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, loadProgress, getServerSnapshot)
}

/** 앱 전체 마스코트로 쓸 대표 캐릭터 id. 고른 적이 없으면 기본 오렌지 고양이. */
export function useSelectedCreatureId(defaultId: string): string {
  const progress = useProgress()
  return progress.selectedCreature ?? defaultId
}

/**
 * prevStageId는 논리적 진행 순서상 바로 앞 Stage의 id다(data/vocab-stages.ts의
 * Stage.prevStageId). Stage id 자체의 산술적 크기에 기대지 않는다 — id는 챕터
 * 고유 id 기반이라 연속된 정수가 아니다.
 */
export function isStageUnlocked(progress: Progress, prevStageId: number | null): boolean {
  if (prevStageId === null) return true
  return Boolean(progress.stagesCleared[prevStageId]?.cleared)
}

export interface ChapterProgress {
  clearedStages: number
  totalStages: number
  stars: number
  maxStars: number
  /** 챕터의 Stage 중 하나라도 열려 있으면 챕터가 열린 것으로 본다. */
  unlocked: boolean
  done: boolean
}

/** 챕터 목록에서 보여줄 진행률을 계산한다. */
export function chapterProgress(
  progress: Progress,
  stages: { id: number; prevStageId: number | null }[]
): ChapterProgress {
  const clearedStages = stages.filter((s) => progress.stagesCleared[s.id]?.cleared).length
  const stars = stages.reduce((sum, s) => sum + (progress.stagesCleared[s.id]?.stars ?? 0), 0)

  return {
    clearedStages,
    totalStages: stages.length,
    stars,
    maxStars: stages.length * 3,
    unlocked: stages.some((s) => isStageUnlocked(progress, s.prevStageId)),
    done: stages.length > 0 && clearedStages === stages.length,
  }
}

export function starsForCorrectCount(correctCount: number): number {
  if (correctCount >= 9) return 3
  if (correctCount >= 6) return 2
  return 1
}

export function pointsForCorrectCount(correctCount: number): number {
  return correctCount * 2
}

export function recordStageResult(stageId: number, correctCount: number): StageResult {
  const progress = loadProgress()
  const stars = starsForCorrectCount(correctCount)
  const points = pointsForCorrectCount(correctCount)
  const previous = progress.stagesCleared[stageId]
  const isFirstClear = !previous?.cleared
  const nextStars = Math.max(previous?.stars ?? 0, stars)
  const pointsEarned = isFirstClear ? points : 0

  const nextProgress: Progress = {
    ...progress,
    stagesCleared: {
      ...progress.stagesCleared,
      [stageId]: { cleared: true, stars: nextStars },
    },
    points: progress.points + pointsEarned,
  }

  saveProgress(nextProgress)

  return { stars, pointsEarned, isFirstClear, totalPoints: nextProgress.points }
}

export function resetProgress(): void {
  saveProgress(EMPTY_PROGRESS)
}

/**
 * 동물 캐릭터를 구매한다. 이미 보유했거나 츄가 부족하면 아무 일도 하지 않고
 * false를 반환한다 (상점 화면은 이 값으로 구매 버튼 상태를 정한다).
 */
export function purchaseCreature(creatureId: string, price: number): boolean {
  const progress = loadProgress()
  if (progress.ownedCreatures.includes(creatureId)) return false
  if (progress.points < price) return false

  saveProgress({
    ...progress,
    points: progress.points - price,
    ownedCreatures: [...progress.ownedCreatures, creatureId],
  })
  return true
}

export function isCreatureOwned(progress: Progress, creatureId: string, defaultId: string): boolean {
  return creatureId === defaultId || progress.ownedCreatures.includes(creatureId)
}

/** 보유한 캐릭터만 대표로 고를 수 있다. */
export function selectCreature(creatureId: string, defaultId: string): void {
  const progress = loadProgress()
  if (!isCreatureOwned(progress, creatureId, defaultId)) return
  saveProgress({ ...progress, selectedCreature: creatureId })
}
