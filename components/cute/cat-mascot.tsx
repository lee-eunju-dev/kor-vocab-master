"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/ref-image/ref-image01.jpg의 전신 고양이를 기준으로 그린 마스코트.
// 앉은 몸통 + 큰 머리 + 포즈별 앞발로 감정을 표현한다.
type CatExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type CatTone = "orange" | "white" | "gray"

const TONE_STOPS: Record<
  CatTone,
  { light: string; base: string; deep: string; patch: string; patchDeep: string }
> = {
  orange: {
    light: "#FFFDF8",
    base: "#FDF3E4",
    deep: "#F0DFC4",
    patch: "#FBC98E",
    patchDeep: "#E9A055",
  },
  white: {
    light: "#FFFFFF",
    base: "#FDF8F0",
    deep: "#EFE4D2",
    patch: "#F6E7D0",
    patchDeep: "#DFCBAB",
  },
  gray: {
    light: "#FBFAFD",
    base: "#EAE6F0",
    deep: "#D2CADD",
    patch: "#CFC6DC",
    patchDeep: "#AFA3C2",
  },
}

interface CatMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: CatExpression
  tone?: CatTone
  float?: boolean
}

function CatMascot({
  className,
  expression = "happy",
  tone = "orange",
  float = false,
  ...props
}: CatMascotProps) {
  const uid = useId()
  const coatId = `coat-${uid}`
  const patchId = `patch-${uid}`
  const earId = `ear-${uid}`
  const blushId = `blush-${uid}`
  const crownId = `crown-${uid}`
  const shadowId = `shadow-${uid}`

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
      aria-label={`고양이 캐릭터 (${expression})`}
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
        {/* 꼬리 — 몸통 뒤에서 오른쪽으로 말려 올라간다 */}
        <path
          d="M70 88 C85 87 93 74 88 63 C85 56 76 57 75 64 C74 71 80 77 69 80 Z"
          fill={`url(#${patchId})`}
          stroke={ink}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        {/* 앉은 몸통 */}
        <path
          d="M50 46 C68 46 79 63 79 79 C79 92 66 98 50 98 C34 98 21 92 21 79 C21 63 32 46 50 46 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 앞발 두 짝 */}
        <ellipse cx="38" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />
        <ellipse cx="62" cy="91" rx="8" ry="5.6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 귀 */}
        <path
          d="M28 24 C23 14 22 6 27 5 C33 4 40 12 44 19 Z"
          fill={`url(#${patchId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M72 24 C77 14 78 6 73 5 C67 4 60 12 56 19 Z"
          fill={`url(#${patchId})`}
          stroke={ink}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path d="M30 21 C28 15 28 10 30 10 C33 10 37 15 39 19 Z" fill={`url(#${earId})`} />
        <path d="M70 21 C72 15 72 10 70 10 C67 10 63 15 61 19 Z" fill={`url(#${earId})`} />

        {/* 머리 */}
        <path
          d="M50 10 C69 10 83 24 83 41 C83 57 68 67 50 67 C32 67 17 57 17 41 C17 24 31 10 50 10 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 이마 얼룩 (레퍼런스의 투톤 배색) */}
        <path
          d="M50 10 C62 10 72 16 78 26 C70 21 60 19 50 19 C40 19 30 21 22 26 C28 16 38 10 50 10 Z"
          fill={`url(#${patchId})`}
          opacity="0.95"
        />

        {/* 광택 */}
        <path d="M28 32 C24 39 24 47 27 52 C21 47 20 37 28 32 Z" fill="#FFFFFF" opacity="0.4" />

        {/* 볼터치 */}
        <circle cx="30" cy="50" r="8.5" fill={`url(#${blushId})`} />
        <circle cx="70" cy="50" r="8.5" fill={`url(#${blushId})`} />

        {/* 눈 */}
        {leftEyeClosed ? (
          <path d="M32 42 C36 35 43 35 47 42" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="39" cy="43" rx="4.6" ry="5.8" fill={ink} />
            <circle cx="37.3" cy="40.4" r="1.7" fill="#FFFFFF" />
          </g>
        )}
        {rightEyeClosed ? (
          <path d="M53 42 C57 35 64 35 68 42" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="61" cy="43" rx="4.6" ry="5.8" fill={ink} />
            <circle cx="59.3" cy="40.4" r="1.7" fill="#FFFFFF" />
          </g>
        )}

        {/* 눈물 (오답·초기화 안내에서 쓰는 표정) */}
        {isSad && (
          <g fill="#7FC7F5" stroke={ink} strokeWidth="1.6">
            <path d="M35 50 C37 54 39 56 37 58 C35 60 32 58 33 55 Z" />
            <path d="M65 50 C67 54 69 56 67 58 C65 60 62 58 63 55 Z" />
          </g>
        )}

        {/* 코 */}
        <path d="M45.5 50 C45.5 47.6 54.5 47.6 54.5 50 C54.5 53 50 55.2 50 55.2 C50 55.2 45.5 53 45.5 50 Z" fill="#E8798F" />

        {/* 입 */}
        {smiling ? (
          <path
            d="M41 55.5 C44.5 61 48 61 50 55.8 C52 61 55.5 61 59 55.5"
            stroke={ink}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : isSad ? (
          <path d="M44 60 C47 56 53 56 56 60" stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M45 57 C47.5 59.5 52.5 59.5 55 57" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* 수염 */}
        <path d="M4 42 C10 43 14 44 20 46" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M4 54 C10 53 14 52 20 50" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M96 42 C90 43 86 44 80 46" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M96 54 C90 53 86 52 80 50" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />

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

export { CatMascot }
export type { CatExpression, CatTone }
