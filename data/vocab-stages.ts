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

// 챕터별로 단어를 10개씩 끊어 Stage를 만든다.
//
// Stage id는 챕터 고유 id(source.id) 기반으로 계산한다(예: 챕터 3의 3번째
// Stage는 303). 그래서 CHAPTER_SOURCES 배열에서 챕터의 "위치"가 바뀌거나 새
// 챕터가 어디에 끼어들어도, 기존 챕터의 Stage id는 절대 바뀌지 않는다 — 이미
// 기기에 저장된 클리어 기록이 엉뚱한 Stage에 붙는 일이 없다.
//
// 반면 "순차 잠금"과 "다음 Stage로 이동"에 쓰는 논리적 순서(prevStageId,
// nextStageId)는 CHAPTER_SOURCES 배열 순서(=화면 노출 순서) 그대로 따른다.
// 그래서 새 챕터를 중간에 끼우면 그 뒤 챕터들이 열리는 순서는 바뀔 수 있지만,
// 그건 저장된 기록이 깨지는 것과는 다른, 훨씬 가벼운 변화다. 새 챕터는 항상
// 각 등급 목록의 맨 끝에 추가하는 편이 이런 순서 변화조차 없어 가장 안전하다.
//
// 10개로 채워지지 않는 남는 단어는 Stage로 만들지 않는다. 스펙이 "Stage 진입 시
// 문제는 항상 10개"를 보장하므로, 문제가 3개뿐인 Stage를 만들면 안 된다.
// 따라서 각 챕터의 words는 10의 배수로 채워야 하고, 아니면 남는 단어는 버려진다.
function buildChapters(): Chapter[] {
  let wordCursor = 0
  const stagesInOrder: Stage[] = []

  const chapters = CHAPTER_SOURCES.map((source) => {
    const stageCount = Math.floor(source.words.length / QUESTIONS_PER_STAGE)

    const stages: Stage[] = Array.from({ length: stageCount }, (_, stageIndex) => {
      const start = wordCursor + stageIndex * QUESTIONS_PER_STAGE
      const stage: Stage = {
        id: source.id * 100 + stageIndex + 1,
        chapterId: source.id,
        questions: Array.from({ length: QUESTIONS_PER_STAGE }, (_, i) => buildQuestion(start + i)),
        prevStageId: null,
        nextStageId: null,
      }
      stagesInOrder.push(stage)
      return stage
    })

    wordCursor += source.words.length

    return { id: source.id, title: source.title, grade: source.grade, stages }
  })

  for (let i = 0; i < stagesInOrder.length; i++) {
    stagesInOrder[i].prevStageId = i > 0 ? stagesInOrder[i - 1].id : null
    stagesInOrder[i].nextStageId = i < stagesInOrder.length - 1 ? stagesInOrder[i + 1].id : null
  }

  return chapters
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
