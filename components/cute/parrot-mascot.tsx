"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/specs/creature-collection/spec.md의 "동물 종 자체를 늘려 수집" 방향에 따라
// 포유류 5종과는 완전히 다른 형태(부리·볏·날개·꼬리깃)로 그린 앵무새 마스코트.
// "색색이" 요청에 맞게 머리·몸통·배·날개를 각각 다른 색으로 입혀 화려하게 표현한다.
// 표정 8가지는 다른 동물과 동일한 세트를 지원한다.
type ParrotExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type ParrotTone = "rainbow"

const TONE_STOPS: Record<
  ParrotTone,
  {
    // 몸통(초록)
    light: string
    base: string
    deep: string
    // 배(노랑)
    patch: string
    patchDeep: string
    // 머리(빨강·주황)
    head: string
    headDeep: string
    // 날개(파랑)
    wing: string
    wingDeep: string
  }
> = {
  rainbow: {
    light: "#EFFCE4",
    base: "#A5DF9E",
    deep: "#79C476",
    patch: "#FFF6D0",
    patchDeep: "#FFDD6C",
    head: "#FFB59E",
    headDeep: "#F5765E",
    wing: "#BCE5F9",
    wingDeep: "#73B9E6",
  },
}

interface ParrotMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: ParrotExpression
  tone?: ParrotTone
  float?: boolean
}

function ParrotMascot({
  className,
  expression = "happy",
  tone = "rainbow",
  float = false,
  ...props
}: ParrotMascotProps) {
  const uid = useId()
  const coatId = `parrot-coat-${uid}`
  const patchId = `parrot-patch-${uid}`
  const headId = `parrot-head-${uid}`
  const wingId = `parrot-wing-${uid}`
  const blushId = `parrot-blush-${uid}`
  const crownId = `parrot-crown-${uid}`
  const shadowId = `parrot-shadow-${uid}`

  const { light, base, deep, patch, patchDeep, head, headDeep, wing, wingDeep } = TONE_STOPS[tone]

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
      aria-label={`앵무새 캐릭터 (${expression})`}
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
        <radialGradient id={headId} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={head} />
          <stop offset="100%" stopColor={headDeep} />
        </radialGradient>
        <linearGradient id={wingId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={wing} />
          <stop offset="100%" stopColor={wingDeep} />
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
        {/* 꼬리깃 — 뒤로 길게 늘어진 두 갈래 */}
        <path
          d="M56 88 C66 96 74 100 80 98 C74 92 70 88 68 82 Z"
          fill={`url(#${wingId})`}
          stroke={ink}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M50 90 C56 99 62 104 68 104 C63 97 60 92 59 86 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* 통통한 몸통 */}
        <path
          d="M50 46 C67 46 78 62 78 78 C78 91 65 98 50 98 C35 98 22 91 22 78 C22 62 33 46 50 46 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 배 무늬 */}
        <path
          d="M50 62 C58 62 64 70 63 82 C62 92 56 96 50 96 C44 96 38 92 37 82 C36 70 42 62 50 62 Z"
          fill={`url(#${patchId})`}
        />

        {/* 짧은 발 두 짝 */}
        <path d="M40 96 L38 102 M40 96 L42 101 M40 96 L44 99" stroke="#F1AD5A" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M60 96 L58 101 M60 96 L62 102 M60 96 L64 99" stroke="#F1AD5A" strokeWidth="2.2" strokeLinecap="round" />

        {/* 접힌 날개 — 귀 대신 몸통 옆에 위치. 포즈로 날개를 드는 동안은
            펼친 날개를 대신 그리므로 접힌 날개를 감춘다. */}
        {!isCheering && (
          <path
            d="M24 58 C14 62 10 76 18 88 C24 90 30 84 29 74 C28 66 27 61 24 58 Z"
            fill={`url(#${wingId})`}
            stroke={ink}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        )}
        {!isCheering && !isThinking && !isWaving && (
          <path
            d="M76 58 C86 62 90 76 82 88 C76 90 70 84 71 74 C72 66 73 61 76 58 Z"
            fill={`url(#${wingId})`}
            stroke={ink}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        )}

        {/* 머리 */}
        <path
          d="M50 12 C68 12 81 25 81 40 C81 51 76 58 68 62 C63 65 57 66 50 66 C43 66 37 65 32 62 C24 58 19 51 19 40 C19 25 32 12 50 12 Z"
          fill={`url(#${headId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 볏 — 정수리 위 깃털 세 가닥 */}
        <path d="M42 13 C40 5 41 -1 44 1 C46 6 45 11 44 15 Z" fill={`url(#${wingId})`} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M50 11 C49 2 51 -3 54 0 C55 6 53 11 52 14 Z" fill={`url(#${patchId})`} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M58 13 C58 5 60 -1 62 2 C63 7 61 12 60 15 Z" fill={`url(#${wingId})`} stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />

        {/* 광택 */}
        <path d="M27 30 C23 37 23 45 26 50 C20 45 19 35 27 30 Z" fill="#FFFFFF" opacity="0.35" />

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

        {/* 부리 — 짧게 굽은 갈고리 부리 */}
        {smiling ? (
          <path
            d="M40 56 C40 50 46 47 50 47 C54 47 60 50 60 56 C60 62 54 64 50 64 C46 64 40 62 40 56 Z"
            fill="#FFAB5C"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        ) : isSad ? (
          <path
            d="M41 58 C41 52 46 49 50 49 C54 49 59 52 59 58 C58 61 54 60 50 60 C46 60 42 61 41 58 Z"
            fill="#FFAB5C"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M42 56 C42 51 46 48 50 48 C54 48 58 51 58 56 C58 60 54 61 50 61 C46 61 42 60 42 56 Z"
            fill="#FFAB5C"
            stroke={ink}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        <path d="M46 58 C48 60 52 60 54 58" stroke={ink} strokeWidth="1.4" fill="none" strokeLinecap="round" />

        {/* 포즈별 날개 — 접힌 날개 대신 부채꼴로 펼친 날개를 그린다(포유류의
            "든 손"과 달리, 새는 날개를 펴는 동작으로 같은 감정을 표현한다). */}
        {(isWaving || isCheering) && (
          <g>
            <path
              d="M68 66 C78 58 86 44 88 28 C92 42 90 58 82 70 C78 75 71 73 68 66 Z"
              fill={`url(#${wingId})`}
              stroke={ink}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path d="M74 62 L84 34" stroke={ink} strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
            <path d="M70 66 L78 42" stroke={ink} strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
          </g>
        )}
        {isCheering && (
          <g>
            <path
              d="M32 66 C22 58 14 44 12 28 C8 42 10 58 18 70 C22 75 29 73 32 66 Z"
              fill={`url(#${wingId})`}
              stroke={ink}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path d="M26 62 L16 34" stroke={ink} strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
            <path d="M30 66 L22 42" stroke={ink} strokeWidth="1.3" strokeLinecap="round" opacity="0.35" />
          </g>
        )}
        {isThinking && (
          <g>
            <path
              d="M62 80 C70 74 76 64 76 52 C80 62 78 74 72 82 C68 86 63 85 62 80 Z"
              fill={`url(#${wingId})`}
              stroke={ink}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M67 76 L74 56" stroke={ink} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
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

export { ParrotMascot }
export type { ParrotExpression, ParrotTone }
