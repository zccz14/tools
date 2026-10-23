import type { ComponentProps, ReactNode } from "react"
import { cn } from "../../lib/utils"

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5 sm:p-6", className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-semibold tracking-tight", className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[13px] leading-relaxed text-muted", className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
}

/** Small uppercase label used above values. */
export function FieldLabel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  )
}
