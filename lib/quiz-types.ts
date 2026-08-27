export interface Question {
  word: string
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export interface Stage {
  id: number
  /** 이 Stage가 속한 챕터 번호. Stage 목록에서 되돌아갈 때 쓴다. */
  chapterId: number
  questions: Question[]
}

/** 어휘 등급 구분. 국립국어원 등급의 중급(B)/고급(C)에 대응한다. */
export type Grade = "middle" | "high"

export interface Chapter {
  id: number
  title: string
  grade: Grade
  stages: Stage[]
}

export const GRADE_LABEL: Record<Grade, string> = {
  middle: "중등 필수",
  high: "고등 필수",
}
