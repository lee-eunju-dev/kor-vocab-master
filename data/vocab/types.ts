import type { Grade } from "@/lib/quiz-types"

export interface WordEntry {
  word: string
  definition: string
}

export interface ChapterSource {
  title: string
  grade: Grade
  words: WordEntry[]
}
