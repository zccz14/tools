import * as TabsPrimitive from "@radix-ui/react-tabs"
import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-xl border border-line bg-elevated p-1 sm:w-auto",
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-muted transition-all sm:flex-none",
        "hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink",
        "data-[state=active]:shadow-[0_1px_2px_rgba(16,24,40,0.08)]",
        "focus-visible:outline-none [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("focus-visible:outline-none", className)} {...props} />
}
