// docs/specs/creature-collection/spec.md의 동물 도감·상점에서 다루는 동물 목록.
// 종(species)마다 형태가 다른 독립 SVG(components/cute/*-mascot.tsx)를 쓰고,
// 색상 버전(tone)마다 완전히 새로 그린 그림이므로 여기서는 "구매 가능한 한 마리"
// 단위로 species+tone을 묶어 creature id를 만든다.
export type CreatureSpecies = "cat" | "dog" | "rabbit" | "hamster" | "bear" | "parrot"

export interface CreatureDef {
  id: string
  species: CreatureSpecies
  tone: string
  name: string
  price: number
}

// 오렌지 고양이는 지금까지도 기본 마스코트였던 캐릭터라 값을 받지 않고 처음부터
// 보유한 것으로 취급한다 (spec.md "가정" 섹션: 대표 캐릭터 기본값은 오렌지 고양이).
export const DEFAULT_CREATURE_ID = "cat-orange"

// 가격은 종별로 균일하게 정한다(spec.md "가정" 섹션). 90 Stage를 전부 만점으로
// 클리어하면 최대 1800츄까지 모을 수 있는데(pointsForCorrectCount 참고), 15마리를
// 전부 사려면 그보다 많은 2300츄가 필요하도록 잡아서 다 모으는 데 목표감이 있게 했다.
// 앵무새는 아이가 특히 원해서 추가한 종이라 색상 버전 없이 1종 1색으로만 둔다.
export const CREATURES: CreatureDef[] = [
  { id: "cat-orange", species: "cat", tone: "orange", name: "오렌지 고양이", price: 0 },
  { id: "cat-white", species: "cat", tone: "white", name: "하양 고양이", price: 120 },
  { id: "cat-gray", species: "cat", tone: "gray", name: "회색 고양이", price: 120 },
  { id: "dog-cream", species: "dog", tone: "cream", name: "시바댕댕이", price: 120 },
  { id: "dog-black", species: "dog", tone: "black", name: "턱시도 댕댕이", price: 120 },
  { id: "dog-white", species: "dog", tone: "white", name: "스피츠 댕댕이", price: 120 },
  { id: "rabbit-pink", species: "rabbit", tone: "pink", name: "핑크 토끼", price: 150 },
  { id: "rabbit-gray", species: "rabbit", tone: "gray", name: "회색 토끼", price: 150 },
  { id: "rabbit-brown", species: "rabbit", tone: "brown", name: "초코 토끼", price: 150 },
  { id: "hamster-brown", species: "hamster", tone: "brown", name: "밤톨 햄스터", price: 150 },
  { id: "hamster-white", species: "hamster", tone: "white", name: "윈터화이트 햄스터", price: 150 },
  { id: "hamster-gray", species: "hamster", tone: "gray", name: "은빛 햄스터", price: 150 },
  { id: "bear-honey", species: "bear", tone: "honey", name: "허니 곰돌이", price: 200 },
  { id: "bear-white", species: "bear", tone: "white", name: "폴라 곰돌이", price: 200 },
  { id: "bear-choco", species: "bear", tone: "choco", name: "반달 곰돌이", price: 200 },
  { id: "parrot-rainbow", species: "parrot", tone: "rainbow", name: "무지개 앵무새", price: 200 },
]

const CREATURE_BY_ID = new Map(CREATURES.map((c) => [c.id, c]))

export function getCreature(id: string): CreatureDef | undefined {
  return CREATURE_BY_ID.get(id)
}
