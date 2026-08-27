import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps extends React.ComponentProps<"div"> {
  count: number
  max?: number
}

function StarRating({ count, max = 3, className, ...props }: StarRatingProps) {
  return (
    <div data-slot="star-rating" className={cn("flex items-center gap-1", className)} {...props}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-8 drop-shadow-sm",
            i < count ? "fill-primary text-primary-foreground/40" : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export { StarRating }
