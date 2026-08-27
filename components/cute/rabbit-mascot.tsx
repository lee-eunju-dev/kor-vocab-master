"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/specs/creature-collection/spec.md의 "동물 종 자체를 늘려 수집" 방향에 따라
// CatMascot/DogMascot과는 독립된 형태로 그린 토끼 마스코트.
// 길게 늘어진 귀와 통통한 꼬리로 구분한다. 표정 8가지는 동일한 세트를 지원한다.
type RabbitExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type RabbitTone = "pink" | "gray" | "brown"

const TONE_STOPS: Record<
  RabbitTone,
  { light: string; base: string; deep: string; patch: string; patchDeep: string }
> = {
  pink: {
    light: "#FFFEFF",
    base: "#FBE9F1",
    deep: "#EFC9DC",
    patch: "#FFFFFF",
    patchDeep: "#F3E2EC",
  },
  gray: {
    light: "#FBFAFD",
    base: "#DCD7E6",
    deep: "#B7AFC9",
    patch: "#FFFFFF",
    patchDeep: "#EDE9F2",
  },
  brown: {
    light: "#FFF6EC",
    base: "#E3BE95",
    deep: "#C79662",
    patch: "#FFF9EF",
    patchDeep: "#F0DEC2",
  },
}

interface RabbitMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: RabbitExpression
  tone?: RabbitTone
  float?: boolean
}

function RabbitMascot({
  className,
  expression = "happy",
  tone = "pink",
  float = false,
  ...props
}: RabbitMascotProps) {
  const uid = useId()
  const coatId = `rabbit-coat-${uid}`
  const patchId = `rabbit-patch-${uid}`
  const earId = `rabbit-ear-${uid}`
  const blushId = `rabbit-blush-${uid}`
  const crownId = `rabbit-crown-${uid}`
  const shadowId = `rabbit-shadow-${uid}`

  const { light, base, deep, patch, patchDeep } = TONE_STOPS[tone]

  const showCrown = expression === "crown"
  const isWaving = expression === "wave" || expression === "crown"
  const isCheering = expression === "cheer"
  const isThinking = expression === "think"
  const isSad = expression === "sad"

  const smiling = expression === "happy" || expression === "wink" || isWaving || isCheering
  const leftEyeClosed = smiling
  const rightEyeClosed = smiling && expression !== "wink"

  const ink = "var(--ink)"

  return (
    <svg
      viewBox="0 0 100 104"
      className={cn("size-16 overflow-visible", float && "animate-cute-float", className)}
      role="img"
      aria-label={`토끼 캐릭터 (${expression})`}
      {...props}
    >
      <defs>
        <radialGradient id={coatId} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="62%" stopColor={base} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <linearGradient id={patchId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={patch} />
          <stop offset="100%" stopColor={patchDeep} />
        </linearGradient>
        <linearGradient id={earId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFDCE9" />
          <stop offset="100%" stopColor="#F6A9C4" />
        </linearGradient>
        <radialGradient id={blushId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9BC0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF9BC0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={crownId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF0B4" />
          <stop offset="100%" stopColor="#FFC63F" />
        </linearGradient>
        <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor={ink} floodOpacity="0.2" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* 꼬리 — 몸 뒤로 동그랗게 뭉친 솜뭉치 */}
        <circle cx="76" cy="82" r="8" fill={`url(#${patchId})`} stroke={ink} strokeWidth="2.4" />

        {/* 앉은 몸통 */}
        <path
          d="M50 46 C68 46 79 63 79 79 C79 92 66 98 50 98 C34 98 21 92 21 79 C21 63 32 46 50 46 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 가슴 무늬 */}
        <path
          d="M50 62 C58 62 64 70 63 82 C62 92 56 96 50 96 C44 96 38 92 37 82 C36 70 42 62 50 62 Z"
          fill={`url(#${patchId})`}
          opacity="0.85"
        />

        {/* 앞발 두 짝 */}
        <ellipse cx="38" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />
        <ellipse cx="62" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 귀 — 길게 위로 뻗은 토끼 귀 */}
        <path
          d="M34 24 C28 5 30 -14 38 -15 C46 -16 50 2 48 22 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M66 24 C72 5 70 -14 62 -15 C54 -16 50 2 52 22 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M37 20 C33 4 35 -9 40 -9 C44 -9 46 3 45 19 Z" fill={`url(#${earId})`} />
        <path d="M63 20 C67 4 65 -9 60 -9 C56 -9 54 3 55 19 Z" fill={`url(#${earId})`} />

        {/* 머리 */}
        <path
          d="M50 12 C68 12 81 25 81 40 C81 51 76 58 68 62 C63 65 57 66 50 66 C43 66 37 65 32 62 C24 58 19 51 19 40 C19 25 32 12 50 12 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 광택 */}
        <path d="M27 30 C23 37 23 45 26 50 C20 45 19 35 27 30 Z" fill="#FFFFFF" opacity="0.5" />

        {/* 볼터치 */}
        <circle cx="27" cy="46" r="7.5" fill={`url(#${blushId})`} />
        <circle cx="73" cy="46" r="7.5" fill={`url(#${blushId})`} />

        {/* 눈 */}
        {leftEyeClosed ? (
          <path d="M29 38 C33 31 40 31 44 38" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="36" cy="39" rx="4.4" ry="5.4" fill={ink} />
            <circle cx="34.3" cy="36.6" r="1.6" fill="#FFFFFF" />
          </g>
        )}
        {rightEyeClosed ? (
          <path d="M56 38 C60 31 67 31 71 38" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="64" cy="39" rx="4.4" ry="5.4" fill={ink} />
            <circle cx="62.3" cy="36.6" r="1.6" fill="#FFFFFF" />
          </g>
        )}

        {/* 눈물 */}
        {isSad && (
          <g fill="#7FC7F5" stroke={ink} strokeWidth="1.6">
            <path d="M32 46 C34 50 36 52 34 54 C32 56 29 54 30 51 Z" />
            <path d="M68 46 C70 50 72 52 70 54 C68 56 65 54 66 51 Z" />
          </g>
        )}

        {/* 코 */}
        <path d="M46 52.5 C46 50.6 54 50.6 54 52.5 C54 55 50 56.8 50 56.8 C50 56.8 46 55 46 52.5 Z" fill="#E8798F" />

        {/* 입 + 앞니 강조 */}
        {smiling ? (
          <g>
            <path
              d="M41 58 C44.5 63 48 63 50 57.8 C52 63 55.5 63 59 58"
              stroke={ink}
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="47.5" y="58" width="5" height="6" rx="1.2" fill="#FFFFFF" stroke={ink} strokeWidth="1.4" />
          </g>
        ) : isSad ? (
          <path d="M44 61 C47 57 53 57 56 61" stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <path d="M46 59 C48 61 52 61 54 59" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <rect x="47.5" y="59" width="5" height="6" rx="1.2" fill="#FFFFFF" stroke={ink} strokeWidth="1.4" />
          </g>
        )}

        {/* 포즈별 앞발 */}
        {(isWaving || isCheering) && (
          <g>
            <path d="M70 68 Q86 60 89 34" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M70 68 Q86 60 89 34" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="89" cy="31" r="7.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isCheering && (
          <g>
            <path d="M30 68 Q14 60 11 34" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M30 68 Q14 60 11 34" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="11" cy="31" r="7.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isThinking && (
          <g>
            <path d="M66 80 Q68 68 60 61" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M66 80 Q68 68 60 61" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="59" cy="59" r="7" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}

        {showCrown && (
          <g>
            <path
              d="M31 11 C33 1 37 -2 40 5 C44 -4 50 -6 54 5 C57 -2 61 1 63 11 C63 14 59 16 47 16 C35 16 31 14 31 11 Z"
              fill={`url(#${crownId})`}
              stroke={ink}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="47" cy="6" r="3.2" fill="#FF8FB3" stroke={ink} strokeWidth="1.4" />
          </g>
        )}
      </g>
    </svg>
  )
}

export { RabbitMascot }
export type { RabbitExpression, RabbitTone }
