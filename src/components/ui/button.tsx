"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Poster buttons: a solid ink pill with a second impression offset behind it.
 * Pressing it pushes the button onto its own shadow.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2",
    "font-extrabold uppercase tracking-[0.1em] leading-none",
    "transition-[transform,box-shadow,background-color] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0",
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    "motion-reduce:transition-none motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-ink-rose hover:bg-brand-blue",
        secondary:
          "border-brand-rose/60 bg-card text-foreground shadow-ink-rose hover:bg-secondary",
        outline:
          "border-brand-blue/50 bg-transparent text-brand-blue shadow-ink-blue hover:bg-accent",
        ghost:
          "border-transparent text-foreground shadow-none hover:border-brand-rose/40 hover:bg-secondary active:translate-x-0 active:translate-y-0",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground shadow-ink-red hover:opacity-90",
        link: "border-transparent normal-case tracking-normal text-brand-blue underline decoration-brand-rose decoration-2 underline-offset-4 shadow-none hover:decoration-brand-blue active:translate-x-0 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-[0.66rem]",
        default: "h-11 px-6 text-[0.72rem]",
        lg: "h-13 px-8 text-[0.8rem]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
