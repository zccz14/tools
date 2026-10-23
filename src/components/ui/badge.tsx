import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] tracking-tight text-muted",
        className,
      )}
      {...props}
    />
  )
}
