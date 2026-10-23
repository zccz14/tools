import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-ink shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95",
        secondary:
          "bg-elevated text-ink border border-line hover:border-accent/40 hover:text-accent",
        outline:
          "border border-line bg-transparent text-ink hover:bg-elevated hover:border-accent/40",
        ghost: "text-muted hover:bg-elevated hover:text-ink",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        default: "h-11 px-5",
        lg: "h-12 px-6 text-[15px]",
        icon: "size-9",
        iconSm: "size-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
