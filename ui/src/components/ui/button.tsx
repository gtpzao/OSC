import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "border-primary/70 bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(8,16,5,0.45),0_0_24px_rgba(196,255,103,0.18)] hover:bg-primary/90 hover:border-primary",
        cta: "border-[#ffd08a] bg-[#ff9f2f] text-[#120c02] shadow-[0_0_28px_rgba(255,159,47,0.28)] hover:bg-[#ffb24f]",
        destructive:
          "border-destructive/70 bg-destructive text-[#1f0803] hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70",
        outline:
          "border-border bg-background/85 text-foreground shadow-none hover:border-primary/60 hover:bg-accent/80 hover:text-accent-foreground dark:bg-input/40",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost:
          "border-transparent hover:border-border hover:bg-accent/75 hover:text-accent-foreground dark:hover:bg-accent/60",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-10",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}, ref) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
