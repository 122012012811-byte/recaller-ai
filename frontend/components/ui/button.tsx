import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
}

export const buttonVariants = ({ variant = "default", size = "default" }: Pick<ButtonProps, "variant" | "size">) =>
  cn(
    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-white/90 text-slate-900 shadow-lg hover:bg-white",
    variant === "secondary" && "bg-white/15 text-white hover:bg-white/20",
    variant === "ghost" && "bg-transparent text-white hover:bg-white/10",
    variant === "outline" && "border border-white/30 bg-white/5 text-white hover:bg-white/10",
    size === "default" && "h-11 px-5",
    size === "sm" && "h-9 px-4 text-xs",
    size === "icon" && "h-11 w-11",
  );

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";

export { Button };
