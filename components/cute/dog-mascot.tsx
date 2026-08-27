"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/specs/creature-collection/spec.md의 "동물 종 자체를 늘려 수집" 방향에 따라
// CatMascot과는 독립된 형태로 그린 시바견 톤 강아지 마스코트.
// 표정 8가지는 CatMascot과 동일한 세트를 지원하고, 색상 버전마다 몸통·가슴 배색을
// 다르게 줘서 같은 형태 안에서도 다른 품종처럼 보이게 한다.
type DogExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type DogTone = "cream" | "black" | "white"

const TONE_STOPS: Record<
  DogTone,
  { light: string; base: string; deep: string; patch: string; patchDeep: string }
> = {
  cream: {
    light: "#FFFCF6",
    base: "#F8DEB0",
    deep: "#E7BD7C",
    patch: "#FFFFFF",
    patchDeep: "#F0E7D6",
  },
  black: {
    // 눈(--ink)이 명도가 낮아, 얼굴 중심부(그라데이션 앞쪽)는 눈과 구분되도록
    // 충분히 밝게 두고 몸통 가장자리(deep)만 어둡게 해서 "검은 개" 느낌을 낸다.
    light: "#9B948C",
    base: "#6B645C",
    deep: "#332D29",
    patch: "#FFFFFF",
    patchDeep: "#EDE7DC",
  },
  white: {
    light: "#FFFFFF",
    base: "#F5F3EE",
    deep: "#DED7C7",
    patch: "#FFF8E8",
    patchDeep: "#EFE3C4",
  },
}

interface DogMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: DogExpression
  tone?: DogTone
  float?: boolean
}

function DogMascot({
  className,
  expression = "happy",
  tone = "cream",
  float = false,
  ...props
}: DogMascotProps) {
  const uid = useId()
  const coatId = `dog-coat-${uid}`
  const patchId = `dog-patch-${uid}`
  const earId = `dog-ear-${uid}`
  const blushId = `dog-blush-${uid}`
  const crownId = `dog-crown-${uid}`
  const shadowId = `dog-shadow-${uid}`

  const { light, base, deep, patch, patchDeep } = TONE_STOPS[tone]

  const showCrown = expression === "crown"
  const isWaving = expression === "wave" || expression === "crown"
  const isCheering = expression === "cheer"
  const isThinking = expression === "think"
  const isSad = expression === "sad"

  // 눈웃음(^^)을 짓는 표정들. 슬픔·생각 중일 때는 눈을 뜬다.
  const smiling = expression === "happy" || expression === "wink" || isWaving || isCheering
  const leftEyeClosed = smiling
  const rightEyeClosed = smiling && expression !== "wink"

  const ink = "var(--ink)"

  return (
    <svg
      viewBox="0 0 100 104"
      className={cn("size-16 overflow-visible", float && "animate-cute-float", className)}
      role="img"
      aria-label={`강아지 캐릭터 (${expression})`}
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
          <stop offset="0%" stopColor="#FFE0EC" />
          <stop offset="100%" stopColor="#F7AFC9" />
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
        {/* 꼬리 — 시바견 특유의 통통하게 말려 등 위로 올라간 꼬리 */}
        <path
          d="M62 83 C73 86 87 81 90 68 C92 59 85 53 79 57"
          stroke={ink}
          strokeWidth="15"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M62 83 C73 86 87 81 90 68 C92 59 85 53 79 57"
          stroke={`url(#${patchId})`}
          strokeWidth="9.4"
          fill="none"
          strokeLinecap="round"
        />

        {/* 앉은 몸통 */}
        <path
          d="M50 46 C68 46 79 63 79 79 C79 92 66 98 50 98 C34 98 21 92 21 79 C21 63 32 46 50 46 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 가슴 흰 무늬 */}
        <path
          d="M50 62 C58 62 64 70 63 82 C62 92 56 96 50 96 C44 96 38 92 37 82 C36 70 42 62 50 62 Z"
          fill={`url(#${patchId})`}
          opacity="0.9"
        />

        {/* 앞발 두 짝 */}
        <ellipse cx="38" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />
        <ellipse cx="62" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 귀 — 쫑긋 선 삼각 귀 */}
        <path
          d="M26 27 C21 15 22 5 29 4 C36 3 41 14 42 23 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M74 27 C79 15 78 5 71 4 C64 3 59 14 58 23 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M28 23 C25 15 26 9 30 9 C34 10 37 16 38 22 Z" fill={`url(#${earId})`} />
        <path d="M72 23 C75 15 74 9 70 9 C66 10 63 16 62 22 Z" fill={`url(#${earId})`} />

        {/* 머리 */}
        <path
          d="M50 12 C68 12 81 25 81 40 C81 51 76 58 68 62 C63 65 57 66 50 66 C43 66 37 65 32 62 C24 58 19 51 19 40 C19 25 32 12 50 12 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 광택 */}
        <path d="M27 30 C23 37 23 45 26 50 C20 45 19 35 27 30 Z" fill="#FFFFFF" opacity="0.4" />

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

        {/* 눈물 (오답·초기화 안내에서 쓰는 표정) */}
        {isSad && (
          <g fill="#7FC7F5" stroke={ink} strokeWidth="1.6">
            <path d="M32 46 C34 50 36 52 34 54 C32 56 29 54 30 51 Z" />
            <path d="M68 46 C70 50 72 52 70 54 C68 56 65 54 66 51 Z" />
          </g>
        )}

        {/* 주둥이 — 앞으로 살짝 튀어나온 형태로 고양이와 구분 */}
        <ellipse
          cx="50"
          cy="57"
          rx="15.5"
          ry="11.5"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.6"
        />

        {/* 코 */}
        <ellipse cx="50" cy="52.5" rx="5.2" ry="4" fill={ink} />

        {/* 입 */}
        {smiling ? (
          <path
            d="M41 60 C44.5 65 48 65 50 59.5 C52 65 55.5 65 59 60"
            stroke={ink}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : isSad ? (
          <path d="M44 63 C47 59 53 59 56 63" stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M46 61 C48 63 52 63 54 61" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* 포즈별 앞발 — 머리 위에 얹어 가려지지 않게 그린다.
            굵은 외곽선 위에 몸 색을 덧칠해 손그림 같은 아웃라인을 만든다. */}
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

export { DogMascot }
export type { DogExpression, DogTone }
