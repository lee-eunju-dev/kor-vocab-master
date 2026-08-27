import { cn } from "@/lib/utils"

interface PhoneFrameProps extends React.ComponentProps<"div"> {
  label?: string
}

function PhoneFrame({ label, className, children, ...props }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-xs font-bold text-muted-foreground">{label}</p>}
      <div
        className={cn(
          "relative w-full max-w-[280px] overflow-hidden rounded-[2.25rem] border-[6px] border-foreground/85 bg-card shadow-[0_10px_0_0_rgba(59,42,42,0.16)]",
          className
        )}
        {...props}
      >
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-2">
          <div className="h-1.5 w-14 rounded-full bg-foreground/30" />
        </div>
        <div className="relative flex min-h-[500px] flex-col overflow-hidden pt-6">{children}</div>
      </div>
    </div>
  )
}

export { PhoneFrame }
