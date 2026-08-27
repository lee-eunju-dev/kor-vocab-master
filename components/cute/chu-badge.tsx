import { PawPrint } from "lucide-react"

import { cn } from "@/lib/utils"

interface ChuBadgeProps extends React.ComponentProps<"div"> {
  amount: number
}

function ChuBadge({ amount, className, ...props }: ChuBadgeProps) {
  const sign = amount >= 0 ? "+" : ""

  return (
    <div
      data-slot="chu-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-4 border-accent-foreground/15 bg-accent px-4 py-1.5 font-bold text-accent-foreground",
        className
      )}
      {...props}
    >
      <PawPrint className="size-4" />
      <span>
        {sign}
        {amount} 츄!
      </span>
    </div>
  )
}

export { ChuBadge }
