"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

// docs/specs/creature-collection/spec.md의 "동물 종 자체를 늘려 수집" 방향에 따라
// 다른 마스코트와 독립된 형태로 그린 곰 마스코트.
// 크고 둥근 귀와 넓은 주둥이로 구분한다. 표정 8가지는 동일한 세트를 지원한다.
type BearExpression =
  | "neutral"
  | "happy"
  | "wink"
  | "crown"
  | "wave"
  | "cheer"
  | "think"
  | "sad"
type BearTone = "honey"

const TONE_STOPS: Record<
  BearTone,
  { light: string; base: string; deep: string; patch: string; patchDeep: string }
> = {
  honey: {
    light: "#FFF7EC",
    base: "#EBC38B",
    deep: "#CE9A57",
    patch: "#FFF3DE",
    patchDeep: "#E8CFA0",
  },
}

interface BearMascotProps extends Omit<React.ComponentProps<"svg">, "id"> {
  expression?: BearExpression
  tone?: BearTone
  float?: boolean
}

function BearMascot({
  className,
  expression = "happy",
  tone = "honey",
  float = false,
  ...props
}: BearMascotProps) {
  const uid = useId()
  const coatId = `bear-coat-${uid}`
  const patchId = `bear-patch-${uid}`
  const earId = `bear-ear-${uid}`
  const blushId = `bear-blush-${uid}`
  const crownId = `bear-crown-${uid}`
  const shadowId = `bear-shadow-${uid}`

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
      aria-label={`곰 캐릭터 (${expression})`}
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
          <stop offset="100%" stopColor="#DDA968" />
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
        {/* 앉은 몸통 — 다부지고 둥글다 */}
        <path
          d="M50 48 C69 48 80 64 80 80 C80 92 66 99 50 99 C34 99 20 92 20 80 C20 64 31 48 50 48 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 배 무늬 */}
        <path
          d="M50 64 C58 64 64 72 63 83 C62 92 56 96 50 96 C44 96 38 92 37 83 C36 72 42 64 50 64 Z"
          fill={`url(#${patchId})`}
          opacity="0.9"
        />

        {/* 앞발 두 짝 */}
        <ellipse cx="37" cy="92" rx="8.5" ry="6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />
        <ellipse cx="63" cy="92" rx="8.5" ry="6" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 귀 — 크고 동그란 곰 귀 */}
        <circle cx="24" cy="18" r="12" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
        <circle cx="76" cy="18" r="12" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
        <circle cx="24" cy="18" r="6.4" fill={`url(#${earId})`} />
        <circle cx="76" cy="18" r="6.4" fill={`url(#${earId})`} />

        {/* 머리 */}
        <path
          d="M50 14 C69 14 82 27 82 42 C82 53 77 60 69 64 C64 67 57 68 50 68 C43 68 36 67 31 64 C23 60 18 53 18 42 C18 27 31 14 50 14 Z"
          fill={`url(#${coatId})`}
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 광택 */}
        <path d="M27 32 C23 39 23 47 26 52 C20 47 19 37 27 32 Z" fill="#FFFFFF" opacity="0.35" />

        {/* 볼터치 */}
        <circle cx="27" cy="49" r="7.5" fill={`url(#${blushId})`} />
        <circle cx="73" cy="49" r="7.5" fill={`url(#${blushId})`} />

        {/* 눈 */}
        {leftEyeClosed ? (
          <path d="M29 40 C33 33 40 33 44 40" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="36" cy="41" rx="4.4" ry="5.4" fill={ink} />
            <circle cx="34.3" cy="38.6" r="1.6" fill="#FFFFFF" />
          </g>
        )}
        {rightEyeClosed ? (
          <path d="M56 40 C60 33 67 33 71 40" stroke={ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="64" cy="41" rx="4.4" ry="5.4" fill={ink} />
            <circle cx="62.3" cy="38.6" r="1.6" fill="#FFFFFF" />
          </g>
        )}

        {/* 눈물 */}
        {isSad && (
          <g fill="#7FC7F5" stroke={ink} strokeWidth="1.6">
            <path d="M32 48 C34 52 36 54 34 56 C32 58 29 56 30 53 Z" />
            <path d="M68 48 C70 52 72 54 70 56 C68 58 65 56 66 53 Z" />
          </g>
        )}

        {/* 주둥이 — 넓고 둥글게 튀어나온 형태 */}
        <ellipse cx="50" cy="58" rx="17" ry="12.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.6" />

        {/* 코 */}
        <ellipse cx="50" cy="54" rx="5.6" ry="4.2" fill={ink} />

        {/* 입 */}
        {smiling ? (
          <path
            d="M40 62 C44 68 48 68 50 61.8 C52 68 56 68 60 62"
            stroke={ink}
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : isSad ? (
          <path d="M44 65 C47 61 53 61 56 65" stroke={ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M46 63 C48 65 52 65 54 63" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* 포즈별 앞발 */}
        {(isWaving || isCheering) && (
          <g>
            <path d="M70 70 Q86 62 89 36" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
            <path d="M70 70 Q86 62 89 36" stroke={base} strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="89" cy="33" r="8" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isCheering && (
          <g>
            <path d="M30 70 Q14 62 11 36" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
            <path d="M30 70 Q14 62 11 36" stroke={base} strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="11" cy="33" r="8" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}
        {isThinking && (
          <g>
            <path d="M66 82 Q68 70 60 63" stroke={ink} strokeWidth="13" fill="none" strokeLinecap="round" />
            <path d="M66 82 Q68 70 60 63" stroke={base} strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="59" cy="61" r="7.5" fill={`url(#${coatId})`} stroke={ink} strokeWidth="2.8" />
          </g>
        )}

        {showCrown && (
          <g>
            <path
              d="M31 13 C33 3 37 0 40 7 C44 -2 50 -4 54 7 C57 0 61 3 63 13 C63 16 59 18 47 18 C35 18 31 16 31 13 Z"
              fill={`url(#${crownId})`}
              stroke={ink}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="47" cy="8" r="3.2" fill="#FF8FB3" stroke={ink} strokeWidth="1.4" />
          </g>
        )}
      </g>
    </svg>
  )
}

export { BearMascot }
export type { BearExpression, BearTone }
