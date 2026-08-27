import type { Chapter, Grade, Question, Stage } from "@/lib/quiz-types"

interface WordEntry {
  word: string
  definition: string
}

interface ChapterSource {
  title: string
  grade: Grade
  words: WordEntry[]
}

// 샘플 어휘 데이터. 중고생 국어·논술 지문에 자주 나오는 어휘를 테마별로 묶었다.
//
// 어휘를 늘릴 때는 각 챕터의 words에 항목을 추가하면 된다. 챕터 하나의 단어가
// 10개를 넘으면 10개 단위로 Stage가 자동으로 늘어나고, 화면·로직은 그대로 돈다.
// 챕터 자체를 늘릴 때는 이 배열에 항목을 추가한다.
//
// 주의: Stage 번호는 챕터 순서대로 전체에 걸쳐 이어 붙인다. 그래서 앞 챕터에
// 단어를 끼워 넣으면 뒤 Stage 번호가 밀리고, 이미 저장된 클리어 기록이 다른
// Stage에 붙게 된다. 어휘를 대량으로 채워 넣을 때는 progress-storage의
// STORAGE_KEY 버전을 올려 기록을 새로 시작하는 편이 안전하다.
const CHAPTER_SOURCES: ChapterSource[] = [
  {
    title: "표현 방법",
    grade: "middle",
    words: [
      { word: "개연성", definition: "일이 일어날 수 있는 가능성" },
      { word: "통찰", definition: "사물이나 현상을 꿰뚫어 보는 깊은 이해" },
      { word: "함축", definition: "말이나 글 속에 뜻이 간접적으로 담겨 있음" },
      { word: "역설", definition: "겉으로는 모순돼 보이지만 그 안에 진실을 담은 표현" },
      { word: "반어", definition: "실제와 반대로 표현해서 뜻을 강조하는 방법" },
      { word: "은유", definition: "어떤 대상을 다른 대상에 빗대어 곧바로 표현하는 방법" },
      { word: "직유", definition: "'처럼', '같이'를 써서 대상을 다른 것에 직접 비유하는 방법" },
      { word: "풍자", definition: "사회나 사람의 잘못을 비웃으며 비판하는 표현 방법" },
      { word: "해학", definition: "익살스럽고 재치 있게 웃음을 자아내는 표현" },
      { word: "대구", definition: "비슷한 문장 구조를 나란히 짝지어 표현하는 방법" },
    ],
  },
  {
    title: "논리와 근거",
    grade: "middle",
    words: [
      { word: "명제", definition: "참과 거짓을 판단할 수 있는 문장" },
      { word: "논증", definition: "근거를 들어 주장이 옳음을 밝히는 과정" },
      { word: "전제", definition: "결론을 이끌어내기 위해 미리 내세우는 판단" },
      { word: "오류", definition: "논리적으로 맞지 않는 잘못된 추론" },
      { word: "궤변", definition: "이치에 맞지 않지만 그럴듯하게 꾸며 대는 말" },
      { word: "타당성", definition: "이치에 맞고 근거가 확실한 성질" },
      { word: "신빙성", definition: "믿을 만한 정도" },
      { word: "객관성", definition: "자기 생각에 치우치지 않고 있는 그대로 보는 성질" },
      { word: "주관성", definition: "자기만의 생각이나 느낌에 치우치는 성질" },
      { word: "보편성", definition: "모든 것에 두루 통하는 성질" },
    ],
  },
  {
    title: "생각과 태도",
    grade: "middle",
    words: [
      { word: "통념", definition: "사회에서 일반적으로 널리 받아들여지는 생각" },
      { word: "고정관념", definition: "쉽게 바뀌지 않고 굳어져 버린 생각" },
      { word: "편견", definition: "공정하지 못하고 한쪽으로 치우친 생각" },
      { word: "관습", definition: "오랫동안 지켜 내려와 사회적으로 굳어진 행동 방식" },
      { word: "담론", definition: "어떤 주제를 놓고 이야기를 주고받는 것" },
      { word: "이념", definition: "어떤 것에 대해 가지는 근본적인 생각이나 신념" },
      { word: "냉소", definition: "쌀쌀한 태도로 비웃음" },
      { word: "자조", definition: "스스로를 비웃음" },
      { word: "관조", definition: "차분한 마음으로 사물이나 상황을 바라봄" },
      { word: "예찬", definition: "무엇이 훌륭하다고 크게 칭찬함" },
    ],
  },
  {
    title: "성질과 정도",
    grade: "high",
    words: [
      { word: "필연성", definition: "반드시 그렇게 될 수밖에 없는 성질" },
      { word: "우연성", definition: "뜻하지 않게 일어날 수 있는 성질" },
      { word: "잠재성", definition: "겉으로 드러나지 않고 속에 숨어 있는 가능성" },
      { word: "가변성", definition: "상황에 따라 변할 수 있는 성질" },
      { word: "불변성", definition: "변하지 않는 성질" },
      { word: "상대성", definition: "다른 것과 비교했을 때만 의미가 있는 성질" },
      { word: "절대성", definition: "다른 것과 비교하지 않고도 그 자체로 의미가 있는 성질" },
      { word: "유추", definition: "비슷한 점을 근거로 다른 부분도 그러할 것이라 미루어 짐작함" },
      { word: "함의", definition: "말이나 글 속에 담겨 있는 속뜻" },
      { word: "논지", definition: "글이나 말에서 주장하려는 중심 내용" },
    ],
  },
  {
    title: "사고와 성찰",
    grade: "high",
    words: [
      { word: "초월", definition: "어떤 한계나 범위를 뛰어넘음" },
      { word: "성찰", definition: "자신의 마음이나 행동을 돌아보며 깊이 살핌" },
      { word: "회의감", definition: "어떤 일에 대해 의심을 품는 느낌" },
      { word: "이질감", definition: "서로 달라서 낯설게 느껴지는 느낌" },
      { word: "동질감", definition: "서로 비슷해서 가깝게 느껴지는 느낌" },
      { word: "모순", definition: "두 사실이 서로 앞뒤가 맞지 않음" },
      { word: "왜곡", definition: "사실과 다르게 잘못 해석하거나 그릇되게 함" },
      { word: "간과", definition: "대수롭지 않게 여겨 넘겨버림" },
      { word: "결여", definition: "마땅히 있어야 할 것이 빠지거나 모자람" },
      { word: "지양", definition: "더 나은 방향으로 나아가기 위해 어떤 것을 하지 않음" },
    ],
  },
]

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
