import type { Grade } from "@/lib/quiz-types"

export interface WordEntry {
  word: string
  definition: string
}

export interface ChapterSource {
  /**
   * 챕터 고유 id. 배열에서의 위치와 무관하게 고정된 값이어야 한다.
   * Stage id를 이 값 기반으로 계산하므로, 한번 부여한 id는 절대 바꾸거나
   * 재사용하지 않는다. 새 챕터를 추가할 때는 지금까지 쓰인 적 없는 다음 번호를 쓴다.
   */
  id: number
  title: string
  grade: Grade
  words: WordEntry[]
}
