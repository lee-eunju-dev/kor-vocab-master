"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

interface SkyBackdropProps {
  className?: string
  ground?: boolean
}

function SkyBackdrop({ className, ground = false }: SkyBackdropProps) {
  const uid = useId()
  const skyId = `sky-${uid}`
  const groundId = `ground-${uid}`

  return (
    <svg
      viewBox="0 0 100 160"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-top)" />
          <stop offset="55%" stopColor="var(--sky-mid)" />
          <stop offset="100%" stopColor="var(--background)" />
        </linearGradient>
        <linearGradient id={groundId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grass)" />
          <stop offset="100%" stopColor="var(--grass-deep)" />
        </linearGradient>
      </defs>

      <rect width="100" height="160" fill={`url(#${skyId})`} />

      <g fill="var(--card)" opacity="0.85">
        <path d="M8 22 C4 22 2 18 6 16 C5 11 13 10 15 14 C19 10 27 13 25 18 C29 18 29 24 25 24 Z" />
        <path d="M70 40 C66 40 64 36 68 34 C67 29 75 28 77 32 C81 28 89 31 87 36 C91 36 91 42 87 42 Z" />
        <path d="M20 74 C16 74 14 70 18 68 C17 63 25 62 27 66 C31 62 39 65 37 70 C41 70 41 76 37 76 Z" />
        <path d="M78 96 C74 96 72 92 76 90 C75 85 83 84 85 88 C89 84 97 87 95 92 C99 92 99 98 95 98 Z" />
      </g>

      {ground && <path d="M0 150 C20 142 35 156 50 148 C65 140 80 154 100 146 L100 160 L0 160 Z" fill={`url(#${groundId})`} />}
    </svg>
  )
}

export { SkyBackdrop }
