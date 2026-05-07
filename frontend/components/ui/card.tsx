import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:bg-white/15",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
