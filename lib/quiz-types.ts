export interface Question {
  word: string
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export interface Stage {
  id: number
  questions: Question[]
}
