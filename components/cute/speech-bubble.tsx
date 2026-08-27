import { cn } from "@/lib/utils"

function SpeechBubble({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="speech-bubble"
      className={cn(
        "relative rounded-3xl border-4 border-border bg-card p-5 text-card-foreground",
        "after:absolute after:-bottom-3 after:left-10 after:h-6 after:w-6 after:rotate-45 after:border-r-4 after:border-b-4 after:border-border after:bg-card after:content-['']",
        className
      )}
      {...props}
    />
  )
}

export { SpeechBubble }
