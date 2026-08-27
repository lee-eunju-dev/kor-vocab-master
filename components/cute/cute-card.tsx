import { cn } from "@/lib/utils"

function CuteCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cute-card"
      className={cn(
        "rounded-3xl border-4 border-border bg-card p-5 text-card-foreground shadow-chunky",
        className
      )}
      {...props}
    />
  )
}

export { CuteCard }
