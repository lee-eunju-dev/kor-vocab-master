// docs/specs/creature-collection/spec.md의 동물 도감·상점에서 다루는 동물 목록.
// 종(species)마다 형태가 다른 독립 SVG(components/cute/*-mascot.tsx)를 쓰고,
// 색상 버전(tone)마다 완전히 새로 그린 그림이므로 여기서는 "구매 가능한 한 마리"
// 단위로 species+tone을 묶어 creature id를 만든다.
export type CreatureSpecies = "cat" | "dog" | "rabbit" | "hamster" | "bear"

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

export const CREATURES: CreatureDef[] = [
  { id: "cat-orange", species: "cat", tone: "orange", name: "오렌지 고양이", price: 0 },
  { id: "cat-white", species: "cat", tone: "white", name: "하양 고양이", price: 60 },
  { id: "cat-gray", species: "cat", tone: "gray", name: "회색 고양이", price: 60 },
  { id: "dog-cream", species: "dog", tone: "cream", name: "시바댕댕이", price: 60 },
  { id: "rabbit-pink", species: "rabbit", tone: "pink", name: "핑크 토끼", price: 80 },
  { id: "hamster-brown", species: "hamster", tone: "brown", name: "밤톨 햄스터", price: 80 },
  { id: "bear-honey", species: "bear", tone: "honey", name: "허니 곰돌이", price: 100 },
]

const CREATURE_BY_ID = new Map(CREATURES.map((c) => [c.id, c]))

export function getCreature(id: string): CreatureDef | undefined {
  return CREATURE_BY_ID.get(id)
}
