import { HIGH_CHAPTERS } from "@/data/vocab/high-words"
import { MIDDLE_CHAPTERS } from "@/data/vocab/middle-words"
import type { ChapterSource, WordEntry } from "@/data/vocab/types"
import type { Chapter, Question, Stage } from "@/lib/quiz-types"

// 어휘 원천 데이터는 등급별로 data/vocab/*-words.ts에 나눠 관리한다.
// (data/vocab/middle-words.ts, data/vocab/high-words.ts)
//
// 어휘를 늘릴 때는 각 챕터의 words에 항목을 추가하면 된다. 챕터 하나의 단어가
// 10개를 넘으면 10개 단위로 Stage가 자동으로 늘어나고, 화면·로직은 그대로 돈다.
// 챕터 자체를 늘릴 때는 해당 등급 파일의 배열에 항목을 추가한다.
//
// 주의: Stage 번호는 챕터 순서대로 전체에 걸쳐 이어 붙인다. 그래서 앞 챕터에
// 단어를 끼워 넣으면 뒤 Stage 번호가 밀리고, 이미 저장된 클리어 기록이 다른
// Stage에 붙게 된다. 어휘를 대량으로 채워 넣을 때는 progress-storage의
// STORAGE_KEY 버전을 올려 기록을 새로 시작하는 편이 안전하다.
const CHAPTER_SOURCES: ChapterSource[] = [...MIDDLE_CHAPTERS, ...HIGH_CHAPTERS]

export const QUESTIONS_PER_STAGE = 10
const DISTRACTOR_OFFSETS = [7, 13, 29]

// 오답 보기는 전체 어휘에서 가져온다. 같은 챕터 안에서만 뽑으면 보기가 지나치게
// 비슷해져 헷갈리기만 하고, 어휘가 적은 챕터에서는 보기를 못 채운다.
const ALL_WORDS: WordEntry[] = CHAPTER_SOURCES.flatMap((chapter) => chapter.words)

function hasFinalConsonant(text: string): boolean {
  const code = text.charCodeAt(text.length - 1)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

function topicParticle(text: string): string {
  return hasFinalConsonant(text) ? "은" : "는"
}

function objectParticle(text: string): string {
  return hasFinalConsonant(text) ? "을" : "를"
}

function buildQuestion(index: number): Question {
  const { word, definition } = ALL_WORDS[index]
  const distractors = DISTRACTOR_OFFSETS.map(
    (offset) => ALL_WORDS[(index + offset) % ALL_WORDS.length].definition
  )
  const answerIndex = index % 4
  const choices = [...distractors]
  choices.splice(answerIndex, 0, definition)

  return {
    word,
    question: `Q. '${word}'의 뜻은?`,
    choices,
    answerIndex,
    explanation: `'${word}'${topicParticle(word)} ${definition}${objectParticle(definition)} 뜻해요.`,
  }
}

// 챕터별로 단어를 10개씩 끊어 Stage를 만들고, Stage 번호는 전체에 걸쳐 1부터 이어 붙인다.
//
// 10개로 채워지지 않는 남는 단어는 Stage로 만들지 않는다. 스펙이 "Stage 진입 시
// 문제는 항상 10개"를 보장하므로, 문제가 3개뿐인 Stage를 만들면 안 된다.
// 따라서 각 챕터의 words는 10의 배수로 채워야 하고, 아니면 남는 단어는 버려진다.
function buildChapters(): Chapter[] {
  let wordCursor = 0
  let stageNumber = 0

  return CHAPTER_SOURCES.map((source, chapterIndex) => {
    const chapterId = chapterIndex + 1
    const stageCount = Math.floor(source.words.length / QUESTIONS_PER_STAGE)

    const stages: Stage[] = Array.from({ length: stageCount }, (_, stageIndex) => {
      stageNumber += 1
      const start = wordCursor + stageIndex * QUESTIONS_PER_STAGE
      return {
        id: stageNumber,
        chapterId,
        questions: Array.from({ length: QUESTIONS_PER_STAGE }, (_, i) => buildQuestion(start + i)),
      }
    })

    wordCursor += source.words.length

    return { id: chapterId, title: source.title, grade: source.grade, stages }
  })
}

/** 10개로 못 채워 Stage에 들어가지 못한 단어 수. 데이터 채울 때 확인용. */
export const UNUSED_WORD_COUNT = CHAPTER_SOURCES.reduce(
  (sum, source) => sum + (source.words.length % QUESTIONS_PER_STAGE),
  0
)

export const CHAPTERS: Chapter[] = buildChapters()

export const STAGES: Stage[] = CHAPTERS.flatMap((chapter) => chapter.stages)

export function getStage(stageId: number): Stage | undefined {
  return STAGES.find((stage) => stage.id === stageId)
}

export function getChapter(chapterId: number): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === chapterId)
}
