import { BookOpen, Check, ChevronLeft, Home, Lock, Music, RotateCcw, Settings, Sparkle, Star, Trophy, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CatMascot } from "@/components/cute/cat-mascot"
import { DogMascot, type DogExpression } from "@/components/cute/dog-mascot"
import { ChuBadge } from "@/components/cute/chu-badge"
import { CuteCard } from "@/components/cute/cute-card"
import { CuteSlider } from "@/components/cute/cute-slider"
import { PhoneFrame } from "@/components/cute/phone-frame"
import { SkyBackdrop } from "@/components/cute/sky-backdrop"
import { SpeechBubble } from "@/components/cute/speech-bubble"
import { StageIsland } from "@/components/cute/stage-island"
import { StarRating } from "@/components/cute/star-rating"
import { cn } from "@/lib/utils"

const CHOICES = [
  { label: "일이 일어날 수 있는 가능성", tone: "orange" as const },
  { label: "확실한 증거", tone: "white" as const },
  { label: "악성할 수 있는", tone: "gray" as const },
  { label: "확실한 안적합", tone: "orange" as const },
]

const DOG_EXPRESSIONS: { expression: DogExpression; label: string }[] = [
  { expression: "neutral", label: "neutral" },
  { expression: "happy", label: "happy" },
  { expression: "wink", label: "wink" },
  { expression: "crown", label: "crown" },
  { expression: "wave", label: "wave" },
  { expression: "cheer", label: "cheer" },
  { expression: "think", label: "think" },
  { expression: "sad", label: "sad" },
]

const CONFETTI = [
  { left: "12%", top: "18%", color: "text-primary", rotate: "-rotate-12" },
  { left: "82%", top: "14%", color: "text-secondary", rotate: "rotate-12" },
  { left: "20%", top: "70%", color: "text-accent-foreground", rotate: "rotate-45" },
  { left: "85%", top: "62%", color: "text-primary", rotate: "-rotate-6" },
  { left: "50%", top: "8%", color: "text-secondary", rotate: "rotate-3" },
]

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold text-primary-foreground [-webkit-text-stroke:3px_var(--card)] [paint-order:stroke]">
            어휘 냥냥
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">전체 화면 UI 뼈대 미리보기</p>
        </header>

        {/* 강아지 마스코트 검증 — creature-collection 스펙: 1종 1색(형태+8표정)을 먼저 완성해 화면에 붙여보는 단계 */}
        <section className="mx-auto mb-10 max-w-3xl rounded-3xl border-4 border-border bg-card p-6">
          <h2 className="mb-1 text-lg font-extrabold">강아지 마스코트 (시바댕댕이 · 크림 톤) — 8표정 검증</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            CatMascot과 같은 8가지 표정을 새 DogMascot 컴포넌트로 그렸다. 형태·비율이 실제 화면에서 어색하지 않은지 확인하는 용도.
          </p>
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
            {DOG_EXPRESSIONS.map(({ expression, label }) => (
              <div key={expression} className="flex flex-col items-center gap-1.5">
                <DogMascot expression={expression} className="size-16" />
                <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 place-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* 타이틀 화면 */}
          <PhoneFrame label="타이틀 화면">
            <div className="relative flex flex-1 flex-col items-center justify-between px-6 pt-10 pb-8 text-center">
              <SkyBackdrop ground />

              <div>
                <h2 className="text-3xl font-extrabold text-primary-foreground [-webkit-text-stroke:3px_var(--card)] [paint-order:stroke]">
                  어휘 냥냥
                </h2>
                <p className="mt-2 text-xs font-bold text-muted-foreground">퀴즈 풀고 냥이 모으기</p>
              </div>

              <CatMascot expression="happy" float className="size-32" />

              <div className="flex w-full flex-col items-center gap-3">
                <Button variant="cute" className="w-full text-base">
                  시작하기
                </Button>
                <p className="text-[11px] text-muted-foreground">v0.1 · 학습 진행 상황은 이 기기에만 저장돼요</p>
              </div>
            </div>
          </PhoneFrame>

          {/* Stage 목록 화면 */}
          <PhoneFrame label="Stage 목록">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop ground />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold">Stage 목록</h3>
                <Button variant="ghost" size="icon-sm" className="rounded-full bg-card/80">
                  <Settings className="size-4" />
                </Button>
              </div>

              <div className="flex flex-col-reverse gap-9 pr-14 pb-2">
                <div className="self-start">
                  <StageIsland n={1} state="cleared" stars={3} />
                </div>
                <div className="self-end">
                  <StageIsland n={2} state="cleared" stars={2} />
                </div>
                <div className="self-start">
                  <StageIsland n={3} state="current" />
                </div>
                <div className="self-end">
                  <StageIsland n={4} state="locked" />
                </div>
              </div>

              <div className="absolute top-14 right-2 flex flex-col gap-1.5 rounded-3xl border-4 border-sidebar-border bg-sidebar p-1.5 shadow-[0_4px_0_0_var(--sidebar-border)]">
                <Button variant="ghost" size="icon-sm" className="rounded-2xl text-sidebar-foreground">
                  <Home className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-2xl text-sidebar-foreground">
                  <BookOpen className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-2xl text-sidebar-foreground">
                  <Trophy className="size-4" />
                </Button>
              </div>
            </div>
          </PhoneFrame>

          {/* 잠긴 Stage 안내 팝업 */}
          <PhoneFrame label="잠긴 Stage 안내">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop ground />

              <div className="mb-4 flex items-center justify-between opacity-40">
                <h3 className="text-base font-extrabold">Stage 목록</h3>
                <Settings className="size-4" />
              </div>

              <div className="flex flex-col-reverse gap-9 pr-14 pb-2 opacity-40">
                <div className="self-start">
                  <StageIsland n={1} state="cleared" stars={3} />
                </div>
                <div className="self-end">
                  <StageIsland n={2} state="cleared" stars={2} />
                </div>
                <div className="self-start">
                  <StageIsland n={3} state="current" />
                </div>
                <div className="self-end">
                  <StageIsland n={4} state="locked" />
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-foreground/35 px-8">
                <CuteCard className="flex w-full flex-col items-center gap-2 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Lock className="size-5" />
                  </div>
                  <p className="text-base font-extrabold">아직 잠겨 있어요</p>
                  <p className="-mt-1 text-xs text-muted-foreground">Stage 3을 먼저 클리어하면 열려요</p>
                  <Button variant="cute" className="mt-1 w-full">
                    확인
                  </Button>
                </CuteCard>
              </div>
            </div>
          </PhoneFrame>

          {/* 퀴즈 화면 */}
          <PhoneFrame label="퀴즈 화면">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop />

              <div className="mb-2 flex items-center gap-3">
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/10 rounded-full bg-secondary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">3/10</span>
                <Button variant="ghost" size="icon-sm" className="rounded-full bg-card/80">
                  <ChevronLeft className="size-4" />
                </Button>
              </div>

              <div className="mb-3 flex justify-center">
                <CatMascot expression="think" className="size-20" />
              </div>

              <SpeechBubble className="mb-5">
                <p className="text-base font-bold">Q. &lsquo;개연성&rsquo;의 뜻은?</p>
              </SpeechBubble>

              <div className="flex flex-col gap-2.5">
                {CHOICES.map((choice, i) => (
                  <Button
                    key={choice.label}
                    variant="cute"
                    className="h-auto justify-start gap-2.5 px-3 py-2.5 text-left text-xs whitespace-normal"
                  >
                    <CatMascot
                      expression={i === 2 ? "wink" : "neutral"}
                      tone={choice.tone}
                      className="size-8 shrink-0"
                    />
                    {choice.label}
                  </Button>
                ))}
              </div>
            </div>
          </PhoneFrame>

          {/* 퀴즈 화면 · 정답 선택(팝업) */}
          <PhoneFrame label="퀴즈 화면 · 정답">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop />

              <div className="mb-2 flex items-center gap-3 opacity-40">
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/10 rounded-full bg-secondary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">3/10</span>
              </div>

              <div className="mb-3 flex justify-center opacity-40">
                <CatMascot expression="happy" className="size-20" />
              </div>

              <div className="opacity-40">
                <SpeechBubble className="mb-4">
                  <p className="text-base font-bold">Q. &lsquo;개연성&rsquo;의 뜻은?</p>
                </SpeechBubble>
              </div>

              <div className="flex flex-col gap-2.5 opacity-40">
                {CHOICES.map((choice, i) => (
                  <Button
                    key={choice.label}
                    variant="cute"
                    className={cn(
                      "h-auto justify-start gap-2.5 px-3 py-2.5 text-left text-xs whitespace-normal",
                      i === 0 && "ring-4 ring-secondary-foreground/30"
                    )}
                  >
                    <CatMascot expression={i === 0 ? "wink" : "neutral"} tone={choice.tone} className="size-8 shrink-0" />
                    {choice.label}
                    {i === 0 && <Check className="ml-auto size-4 shrink-0" />}
                  </Button>
                ))}
              </div>

              {/* 보기를 고르면 이 팝업이 뜨고, 확인해야만 다음 문제로 넘어간다. 화면 크기가 고정된 실제 기기에서 이 흐름이 자연스럽다 */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/35 px-6">
                <CuteCard className="flex w-full flex-col items-center gap-2 text-center">
                  <CatMascot expression="wink" tone="orange" className="size-16" />
                  <p className="text-lg font-extrabold text-secondary-foreground">정답이에요!</p>
                  <p className="-mt-1 text-xs text-muted-foreground">&lsquo;개연성&rsquo;은 일이 일어날 수 있는 가능성을 뜻해요.</p>
                  <Button variant="cuteMint" className="mt-1 w-full">
                    다음 문제
                  </Button>
                </CuteCard>
              </div>
            </div>
          </PhoneFrame>

          {/* 퀴즈 화면 · 오답 선택(팝업) */}
          <PhoneFrame label="퀴즈 화면 · 오답">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop />

              <div className="mb-2 flex items-center gap-3 opacity-40">
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/10 rounded-full bg-secondary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">3/10</span>
              </div>

              <div className="mb-3 flex justify-center opacity-40">
                <CatMascot expression="neutral" className="size-20" />
              </div>

              <div className="opacity-40">
                <SpeechBubble className="mb-4">
                  <p className="text-base font-bold">Q. &lsquo;개연성&rsquo;의 뜻은?</p>
                </SpeechBubble>
              </div>

              <div className="flex flex-col gap-2.5 opacity-40">
                {CHOICES.map((choice, i) => (
                  <Button
                    key={choice.label}
                    variant="cute"
                    className={cn(
                      "h-auto justify-start gap-2.5 px-3 py-2.5 text-left text-xs whitespace-normal",
                      i === 2 && "ring-4 ring-destructive/40",
                      i === 0 && "ring-4 ring-secondary-foreground/30"
                    )}
                  >
                    <CatMascot expression={i === 2 ? "wink" : "neutral"} tone={choice.tone} className="size-8 shrink-0" />
                    {choice.label}
                    {i === 2 && <X className="ml-auto size-4 shrink-0 text-destructive" />}
                    {i === 0 && <Check className="ml-auto size-4 shrink-0" />}
                  </Button>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-foreground/35 px-6">
                <CuteCard className="flex w-full flex-col items-center gap-2 text-center">
                  <CatMascot expression="neutral" tone="gray" className="size-16" />
                  <p className="text-lg font-extrabold">괜찮아요, 다음엔 맞힐 거예요!</p>
                  <p className="-mt-1 text-xs text-muted-foreground">정답은 &lsquo;일이 일어날 수 있는 가능성&rsquo;이에요.</p>
                  <Button variant="cuteMint" className="mt-1 w-full">
                    다음 문제
                  </Button>
                </CuteCard>
              </div>
            </div>
          </PhoneFrame>

          {/* 일시정지 팝업 */}
          <PhoneFrame label="일시정지 팝업">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop />

              <div className="mb-2 flex items-center gap-3 opacity-40">
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/10 rounded-full bg-secondary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">3/10</span>
              </div>
              <div className="opacity-40">
                <SpeechBubble className="mb-5">
                  <p className="text-base font-bold">Q. &lsquo;개연성&rsquo;의 뜻은?</p>
                </SpeechBubble>
              </div>

              {/* 배경을 어둡게 덮는 오버레이 + 중앙 팝업 */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/35 px-6">
                <CuteCard className="flex w-full flex-col items-center gap-3 text-center">
                  <CatMascot expression="neutral" className="size-16" />
                  <p className="text-lg font-extrabold">잠깐 쉴까요?</p>
                  <p className="-mt-2 text-xs text-muted-foreground">지금 나가면 이 Stage는 처음부터 다시 풀어야 해요</p>
                  <div className="flex w-full flex-col gap-2">
                    <Button variant="cute" className="w-full">
                      이어하기
                    </Button>
                    <Button variant="cuteMint" className="w-full">
                      처음부터 다시
                    </Button>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      Stage 목록으로 나가기
                    </Button>
                  </div>
                </CuteCard>
              </div>
            </div>
          </PhoneFrame>

          {/* 결과 화면 */}
          <PhoneFrame label="결과 화면">
            <div className="relative flex flex-1 items-center justify-center px-5">
              <SkyBackdrop />
              <div className="pointer-events-none absolute inset-0">
                {CONFETTI.map((c, i) => (
                  <Star
                    key={i}
                    className={`absolute size-4 fill-current ${c.color} ${c.rotate}`}
                    style={{ left: c.left, top: c.top }}
                  />
                ))}
              </div>

              <CuteCard className="relative z-10 flex w-full flex-col items-center gap-3 text-center">
                <CatMascot expression="crown" float className="size-28" />
                <p className="text-xl font-extrabold">참 잘했어요!</p>
                <StarRating count={3} />
                <ChuBadge amount={10} />
                <div className="flex w-full flex-col gap-2">
                  <Button variant="cute" className="w-full">
                    다음 Stage
                  </Button>
                  <Button variant="cuteMint" className="w-full">
                    해설 보기
                  </Button>
                </div>
              </CuteCard>

              <Sparkle className="absolute top-6 left-6 size-5 fill-primary text-primary-foreground/40" />
              <Sparkle className="absolute right-6 bottom-24 size-4 fill-secondary text-secondary-foreground/40" />
            </div>
          </PhoneFrame>

          {/* 결과 화면 · 최소 별점(★1) */}
          <PhoneFrame label="결과 화면 · ★1">
            <div className="relative flex flex-1 items-center justify-center px-5">
              <SkyBackdrop />

              <CuteCard className="relative z-10 flex w-full flex-col items-center gap-3 text-center">
                <CatMascot expression="happy" float className="size-28" />
                <p className="text-xl font-extrabold">수고했어요!</p>
                <StarRating count={1} />
                <ChuBadge amount={4} />
                <div className="flex w-full flex-col gap-2">
                  <Button variant="cuteMint" className="w-full">
                    다시 도전!
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground">
                    Stage 목록으로
                  </Button>
                </div>
              </CuteCard>
            </div>
          </PhoneFrame>

          {/* 결과 화면 · 재도전(포인트 재지급 없음) */}
          <PhoneFrame label="결과 화면 · 재도전">
            <div className="relative flex flex-1 items-center justify-center px-5">
              <SkyBackdrop />
              <div className="pointer-events-none absolute inset-0">
                {CONFETTI.map((c, i) => (
                  <Star
                    key={i}
                    className={`absolute size-4 fill-current ${c.color} ${c.rotate}`}
                    style={{ left: c.left, top: c.top }}
                  />
                ))}
              </div>

              <CuteCard className="relative z-10 flex w-full flex-col items-center gap-3 text-center">
                <CatMascot expression="crown" float className="size-28" />
                <p className="text-xl font-extrabold">최고 기록 경신!</p>
                <StarRating count={3} />
                <p className="rounded-full border-4 border-muted bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">
                  포인트는 처음 클리어할 때만 받아요
                </p>
                <div className="flex w-full flex-col gap-2">
                  <Button variant="cute" className="w-full">
                    다음 Stage
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground">
                    Stage 목록으로
                  </Button>
                </div>
              </CuteCard>
            </div>
          </PhoneFrame>

          {/* 설정 화면 */}
          <PhoneFrame label="설정 화면">
            <div className="relative flex-1 px-4 pb-4">
              <SkyBackdrop />

              <div className="mb-4 flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" className="rounded-full bg-card/80">
                  <ChevronLeft className="size-4" />
                </Button>
                <h3 className="text-base font-extrabold">설정</h3>
              </div>

              <CuteCard className="mb-4 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
                  <Music className="size-4" /> 소리
                </div>
                <CuteSlider label="배경 음악" defaultValue={70} />
                <CuteSlider label="효과음" defaultValue={85} />
              </CuteCard>

              <CuteCard className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
                  <RotateCcw className="size-4" /> 데이터
                </div>
                <p className="text-xs text-muted-foreground">클리어 기록과 츄 포인트가 이 기기에서 모두 사라져요.</p>
                <Button variant="outline" className="w-full rounded-full border-destructive/40 text-destructive">
                  진행 상황 초기화
                </Button>
              </CuteCard>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
}
