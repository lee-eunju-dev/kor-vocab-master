"use client"

import { useSyncExternalStore } from "react"

export interface StageRecord {
  cleared: boolean
  stars: number
}

export interface Progress {
  stagesCleared: Record<number, StageRecord>
  points: number
}

export interface StageResult {
  stars: number
  pointsEarned: number
  isFirstClear: boolean
  totalPoints: number
}

const STORAGE_KEY = "kor-vocab-master:progress:v3"
const EMPTY_PROGRESS: Progress = { stagesCleared: {}, points: 0 }

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

export function isStageUnlocked(progress: Progress, stageId: number): boolean {
  if (stageId <= 1) return true
  return Boolean(progress.stagesCleared[stageId - 1]?.cleared)
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
export function chapterProgress(progress: Progress, stageIds: number[]): ChapterProgress {
  const clearedStages = stageIds.filter((id) => progress.stagesCleared[id]?.cleared).length
  const stars = stageIds.reduce((sum, id) => sum + (progress.stagesCleared[id]?.stars ?? 0), 0)

  return {
    clearedStages,
    totalStages: stageIds.length,
    stars,
    maxStars: stageIds.length * 3,
    unlocked: stageIds.some((id) => isStageUnlocked(progress, id)),
    done: stageIds.length > 0 && clearedStages === stageIds.length,
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
