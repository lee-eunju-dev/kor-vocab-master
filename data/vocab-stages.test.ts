import { describe, expect, it } from "vitest"

import { CHAPTERS, QUESTIONS_PER_STAGE, STAGES, UNUSED_WORD_COUNT, getChapter, getStage } from "@/data/vocab-stages"

// 어휘 데이터는 앞으로 계속 늘어난다. 늘리다가 규칙을 깨면 화면이 조용히
// 잘못 동작하므로, 스펙이 보장하는 조건들을 데이터 차원에서 붙잡아 둔다.
describe("어휘 데이터", () => {
  it("모든 Stage는 정확히 10문제를 가진다", () => {
    expect(STAGES.length).toBeGreaterThan(0)
    for (const stage of STAGES) {
      expect(stage.questions).toHaveLength(QUESTIONS_PER_STAGE)
    }
  })

  it("모든 문제는 4개의 보기를 가지고, 정답이 보기 안에 있다", () => {
    for (const stage of STAGES) {
      for (const question of stage.questions) {
        expect(question.choices).toHaveLength(4)
        expect(question.answerIndex).toBeGreaterThanOrEqual(0)
        expect(question.answerIndex).toBeLessThan(4)
        expect(question.choices[question.answerIndex]).toBeTruthy()
      }
    }
  })

  it("한 문제 안에서 보기가 중복되지 않는다", () => {
    for (const stage of STAGES) {
      for (const question of stage.questions) {
        expect(new Set(question.choices).size).toBe(4)
      }
    }
  })

  it("모든 Stage id는 유일하다", () => {
    const ids = STAGES.map((stage) => stage.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("Stage id는 소속 챕터의 id로 시작한다", () => {
    // Stage id = chapterId * 100 + 챕터 안 순번. 새 챕터를 어디에 추가해도
    // 기존 Stage id가 안 바뀌게 하려고 챕터 고유 id에서 계산한다.
    for (const stage of STAGES) {
      expect(Math.floor(stage.id / 100)).toBe(stage.chapterId)
    }
  })

  it("prevStageId·nextStageId가 화면 노출 순서와 서로 맞물린다", () => {
    for (let i = 0; i < STAGES.length; i++) {
      const expectedPrev = i > 0 ? STAGES[i - 1].id : null
      const expectedNext = i < STAGES.length - 1 ? STAGES[i + 1].id : null
      expect(STAGES[i].prevStageId).toBe(expectedPrev)
      expect(STAGES[i].nextStageId).toBe(expectedNext)
    }
  })

  it("Stage의 chapterId가 실제로 그 챕터를 가리킨다", () => {
    for (const stage of STAGES) {
      const chapter = getChapter(stage.chapterId)
      expect(chapter).toBeDefined()
      expect(chapter?.stages.some((s) => s.id === stage.id)).toBe(true)
    }
  })

  it("10개로 못 채워 버려지는 단어가 없다", () => {
    // 남으면 그 단어들은 어디에도 안 나온다. 데이터를 10의 배수로 채워야 한다.
    expect(UNUSED_WORD_COUNT).toBe(0)
  })

  it("모든 챕터에 최소 한 개의 Stage가 있다", () => {
    expect(CHAPTERS.length).toBeGreaterThan(0)
    for (const chapter of CHAPTERS) {
      expect(chapter.stages.length).toBeGreaterThan(0)
      expect(chapter.title).toBeTruthy()
    }
  })

  it("getStage는 없는 번호에 undefined를 준다", () => {
    expect(getStage(999999)).toBeUndefined()
    expect(getStage(0)).toBeUndefined()
  })
})
