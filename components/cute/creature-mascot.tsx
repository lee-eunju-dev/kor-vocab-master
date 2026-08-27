"use client"

import { getCreature } from "@/lib/creatures"

import { BearMascot } from "./bear-mascot"
import type { BearTone } from "./bear-mascot"
import { CatMascot } from "./cat-mascot"
import type { CatExpression, CatTone } from "./cat-mascot"
import { DogMascot } from "./dog-mascot"
import type { DogTone } from "./dog-mascot"
import { HamsterMascot } from "./hamster-mascot"
import type { HamsterTone } from "./hamster-mascot"
import { ParrotMascot } from "./parrot-mascot"
import type { ParrotTone } from "./parrot-mascot"
import { RabbitMascot } from "./rabbit-mascot"
import type { RabbitTone } from "./rabbit-mascot"

// 6종 각각 완전히 다른 형태의 SVG를 쓰기 때문에, 대표 캐릭터(creatureId)만 받아서
// 알맞은 종 컴포넌트로 위임하는 얇은 스위치. 표정 8종은 모든 종이 동일하게 지원한다.
export type CreatureExpression = CatExpression

interface CreatureMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  creatureId: string
  expression?: CreatureExpression
  float?: boolean
}

function CreatureMascot({ creatureId, expression, float, ...props }: CreatureMascotProps) {
  const creature = getCreature(creatureId)

  if (!creature) {
    return <CatMascot expression={expression} tone="orange" float={float} {...props} />
  }

  switch (creature.species) {
    case "dog":
      return <DogMascot expression={expression} tone={creature.tone as DogTone} float={float} {...props} />
    case "rabbit":
      return <RabbitMascot expression={expression} tone={creature.tone as RabbitTone} float={float} {...props} />
    case "hamster":
      return (
        <HamsterMascot expression={expression} tone={creature.tone as HamsterTone} float={float} {...props} />
      )
    case "bear":
      return <BearMascot expression={expression} tone={creature.tone as BearTone} float={float} {...props} />
    case "parrot":
      return <ParrotMascot expression={expression} tone={creature.tone as ParrotTone} float={float} {...props} />
    case "cat":
    default:
      return <CatMascot expression={expression} tone={creature.tone as CatTone} float={float} {...props} />
  }
}

export { CreatureMascot }
