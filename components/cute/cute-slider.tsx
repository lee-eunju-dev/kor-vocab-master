import { cn } from "@/lib/utils"

interface CuteSliderProps extends React.ComponentProps<"input"> {
  label: string
}

function CuteSlider({ label, className, defaultValue = 70, ...props }: CuteSliderProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={defaultValue}
        className={cn(
          "h-3 w-full cursor-pointer appearance-none rounded-full bg-muted",
          "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-chunky-xs",
          "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-card [&::-moz-range-thumb]:bg-primary",
          className
        )}
        {...props}
      />
    </label>
  )
}

export { CuteSlider }
