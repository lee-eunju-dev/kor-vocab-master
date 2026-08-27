"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/specs/creature-collection/spec.md의 "동물 종 자체를 늘려 수집" 방향에 따라
// 다른 마스코트와 독립된 형태로 그린 햄스터 마스코트.
// 짧고 둥근 귀, 통통한 볼주머니로 구분한다. 표정 8가지는 동일한 세트를 지원한다.
type HamsterExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type HamsterTone = "brown"

const TONE_STOPS: Record<
  HamsterTone,
  { light: string; base: string; deep: string; patch: string; patchDeep: string }
> = {
  brown: {
    light: "#FFF8EE",
    base: "#F0CE9C",
    deep: "#D9A96A",
    patch: "#FFF6E8",
    patchDeep: "#F0DFC0",
  },
}

interface HamsterMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: HamsterExpression
  tone?: HamsterTone
  float?: boolean
}

function HamsterMascot({
  className,
  expression = "happy",
  tone = "brown",
  float = false,
  ...props
}: HamsterMascotProps) {
  const uid = useId()
  const coatId = `hamster-coat-${uid}`
  const patchId = `hamster-patch-${uid}`
  const earId = `hamster-ear-${uid}`
  const blushId = `hamster-blush-${uid}`
  const crownId = `hamster-crown-${uid}`
  const shadowId = `hamster-shadow-${uid}`

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
      aria-label={`햄스터 캐릭터 (${expression})`}
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
          <stop offset="0%" stopColor="#FFE3C2" />
          <stop offset="100%" stopColor="#F0B984" />
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
        {/* 몸통 — 목이 거의 없이 둥글고 통통하다 */}
        <path
          d="M50 42 C70 42 81 60 81 78 C81 92 67 99 50 99 C33 99 19 92 19 78 C19 60 30 42 50 42 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 배 무늬 */}
        <path
          d="M50 60 C59 60 65 69 64 82 C63 92 57 96 50 96 C43 96 37 92 36 82 C35 69 41 60 50 60 Z"
          fill={`url(#${patchId})`}
          opacity="0.9"
        />

        {/* 앞발 두 짝 */}
        <ellipse cx="37" cy="92" rx="7.5" ry="5.4" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />
        <ellipse cx="63" cy="92" rx="7.5" ry="5.4" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 귀 — 작고 동그란 귀 */}
        <circle cx="26" cy="20" r="10" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
        <circle cx="74" cy="20" r="10" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
        <circle cx="26" cy="20" r="5.4" fill={`url(#${earId})`} />
        <circle cx="74" cy="20" r="5.4" fill={`url(#${earId})`} />

        {/* 머리 — 볼주머니가 부풀어 넓적한 형태 */}
        <path
          d="M50 14 C71 14 85 28 85 43 C85 54 79 60 71 63 C77 68 76 74 70 74 C64 74 61 69 60 65 C57 66 53 66 50 66 C47 66 43 66 40 65 C39 69 36 74 30 74 C24 74 23 68 29 63 C21 60 15 54 15 43 C15 28 29 14 50 14 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 광택 */}
        <path d="M27 30 C23 37 23 45 26 50 C20 45 19 35 27 30 Z" fill="#FFFFFF" opacity="0.4" />

        {/* 볼터치 (통통한 볼주머니) */}
        <circle cx="26" cy="53" r="10" fill={`url(#${blushId})`} />
        <circle cx="74" cy="53" r="10" fill={`url(#${blushId})`} />

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
        <ellipse cx="50" cy="52" rx="4.4" ry="3.4" fill="#C97A56" />

        {/* 입 */}
        {smiling ? (
          <path
            d="M42 57 C45 61.5 48.5 61.5 50 57.5 C51.5 61.5 55 61.5 58 57"
            stroke={ink}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : isSad ? (
          <path d="M44 59 C47 55 53 55 56 59" stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M46 57 C48 59 52 59 54 57" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* 앞니 */}
        <rect x="47.5" y="56" width="5" height="6" rx="1.2" fill="#FFFFFF" stroke={ink} strokeWidth="1.4" />

        {/* 포즈별 앞발 */}
        {(isWaving || isCheering) && (
          <g>
            <path d="M71 66 Q86 58 89 32" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M71 66 Q86 58 89 32" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="89" cy="29" r="7.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isCheering && (
          <g>
            <path d="M29 66 Q14 58 11 32" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M29 66 Q14 58 11 32" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="11" cy="29" r="7.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isThinking && (
          <g>
            <path d="M67 78 Q69 66 61 59" stroke={ink} strokeWidth="12" fill="none" strokeLinecap="round" />
            <path d="M67 78 Q69 66 61 59" stroke={base} strokeWidth="7" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="57" r="7" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
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

export { HamsterMascot }
export type { HamsterExpression, HamsterTone }
