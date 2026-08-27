"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

type CatExpression = "neutral" | "happy" | "wink" | "crown"
type CatTone = "orange" | "white" | "gray"

const TONE_STOPS: Record<CatTone, { light: string; base: string; deep: string }> = {
  orange: { light: "#FFE1BE", base: "#F6B98B", deep: "#E5964F" },
  white: { light: "#FFFFFF", base: "#FDF6EC", deep: "#EFDFC4" },
  gray: { light: "#F1ECF6", base: "#D9D3E0", deep: "#B9AFC6" },
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
  const headGradId = `cat-head-${uid}`
  const earGradId = `cat-ear-${uid}`
  const pawGradId = `cat-paw-${uid}`
  const blushGradId = `cat-blush-${uid}`
  const crownGradId = `cat-crown-${uid}`
  const shadowId = `cat-shadow-${uid}`

  const { light, base, deep } = TONE_STOPS[tone]
  const showCrown = expression === "crown"
  const isSmiling = expression === "happy" || expression === "wink" || expression === "crown"
  const leftEyeClosed = isSmiling
  const rightEyeClosed = expression === "happy" || expression === "crown"

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-16 overflow-visible", float && "animate-cute-float", className)}
      role="img"
      aria-label={`고양이 캐릭터 (${expression})`}
      {...props}
    >
      <defs>
        <radialGradient id={headGradId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="60%" stopColor={base} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <linearGradient id={earGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE3EE" />
          <stop offset="100%" stopColor="#F6A8C6" />
        </linearGradient>
        <linearGradient id={pawGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={base} />
        </linearGradient>
        <radialGradient id={blushGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9EC3" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FF9EC3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={crownGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEFB0" />
          <stop offset="100%" stopColor="#FFC94D" />
        </linearGradient>
        <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="var(--ink)" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        {/* 뒤쪽 귀 (부드러운 곡선) */}
        <path
          d="M21 36 C12 24 7 11 12 6 C19 1 32 9 40 24 C34 29 26 33 21 36 Z"
          fill={`url(#${earGradId})`}
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M79 36 C88 24 93 11 88 6 C81 1 68 9 60 24 C66 29 74 33 79 36 Z"
          fill={`url(#${earGradId})`}
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M24 30 C19 22 17 13 20 10 C25 8 32 16 36 24 C32 27 27 29 24 30 Z" fill="#FFD3E6" opacity="0.9" />
        <path d="M76 30 C81 22 83 13 80 10 C75 8 68 16 64 24 C68 27 73 29 76 30 Z" fill="#FFD3E6" opacity="0.9" />

        {/* 볼록한 젤리 체형 얼굴 */}
        <path
          d="M50 20 C68 20 85 32 87 52 C89 70 78 87 66 92 C60 95 55 96 50 96
             C45 96 40 95 34 92 C22 87 11 70 13 52 C15 32 32 20 50 20 Z"
          fill={`url(#${headGradId})`}
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 광택 하이라이트 */}
        <path d="M28 34 C24 42 23 50 26 56 C20 50 20 38 28 34 Z" fill="#FFFFFF" opacity="0.45" />

        {/* 볼터치 */}
        <circle cx="24" cy="64" r="10" fill={`url(#${blushGradId})`} />
        <circle cx="76" cy="64" r="10" fill={`url(#${blushGradId})`} />

        {/* 앞발 (턱 아래로 살짝 보이는 젤리 발) */}
        <path
          d="M30 88 C28 80 34 75 40 76 C46 77 48 84 45 90 C41 95 33 95 30 88 Z"
          fill={`url(#${pawGradId})`}
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        <path
          d="M70 88 C72 80 66 75 60 76 C54 77 52 84 55 90 C59 95 67 95 70 88 Z"
          fill={`url(#${pawGradId})`}
          stroke="var(--ink)"
          strokeWidth="2.5"
        />

        {/* 왼쪽 눈 */}
        {leftEyeClosed ? (
          <path d="M30 52 C34 46 40 46 44 52" stroke="var(--ink)" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="37" cy="53" rx="4.2" ry="5.2" fill="var(--ink)" />
            <circle cx="35.5" cy="50.5" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* 오른쪽 눈 */}
        {rightEyeClosed ? (
          <path d="M56 52 C60 46 66 46 70 52" stroke="var(--ink)" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx="63" cy="53" rx="4.2" ry="5.2" fill="var(--ink)" />
            <circle cx="61.5" cy="50.5" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* 코 */}
        <path d="M47 61 C47 59 53 59 53 61 C53 64 50 65.5 50 65.5 C50 65.5 47 64 47 61 Z" fill="#E8798F" />

        {/* 입 */}
        {isSmiling ? (
          <path
            d="M42 66 C45 71 48 71 50 66.5 C52 71 55 71 58 66"
            stroke="var(--ink)"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path d="M46 68 C48 70 52 70 54 68" stroke="var(--ink)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        )}

        {/* 수염 */}
        <path d="M6 54 C13 55 18 56 25 58" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M6 66 C13 64 18 63 25 62" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M94 54 C87 55 82 56 75 58" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M94 66 C87 64 82 63 75 62" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {showCrown && (
          <g>
            <path
              d="M27 22 C29 10 33 6 36 13 C40 4 46 1 50 1 C54 1 60 4 64 13 C67 6 71 10 73 22
                 C73 25 70 27 50 27 C30 27 27 25 27 22 Z"
              fill={`url(#${crownGradId})`}
              stroke="var(--ink)"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="16" r="3.4" fill="#FF8FB3" stroke="var(--ink)" strokeWidth="1.4" />
            <path d="M14 30 L17 34 L14 38 L11 34 Z" fill="#FFEFB0" opacity="0.9" />
            <path d="M88 40 L91 44 L88 48 L85 44 Z" fill="#FFEFB0" opacity="0.9" />
          </g>
        )}
      </g>
    </svg>
  )
}

export { CatMascot }
export type { CatExpression, CatTone }
