import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

const field =
  "w-full rounded-xl border border-line bg-surface text-ink transition-colors placeholder:text-muted/70 focus:border-accent/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, "h-10 px-3 text-sm", className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(field, "p-3 font-mono text-[13px] leading-relaxed", className)}
      {...props}
    />
  )
}
