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
  /**
   * 논리적 진행 순서(화면 노출 순서)상 바로 앞/뒤 Stage id.
   * 순차 잠금 판정과 "다음 Stage" 이동에 쓴다. id 자체는 챕터 고유 id 기반으로
   * 고정되어 있어서 새 챕터를 추가해도 안 바뀌지만, prev/next는 챕터 배열 순서가
   * 바뀌면 함께 바뀔 수 있다.
   */
  prevStageId: number | null
  nextStageId: number | null
}

/** 어휘 등급 구분. 국립국어원 등급의 초급(A, 초등 4학년 이상)/중급(B)/고급(C)에 대응한다. */
export type Grade = "elementary" | "middle" | "high"

export interface Chapter {
  id: number
  title: string
  grade: Grade
  stages: Stage[]
}

export const GRADE_LABEL: Record<Grade, string> = {
  elementary: "초등 필수",
  middle: "중등 필수",
  high: "고등 필수",
}
