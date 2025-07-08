import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      checked: {
        false: "bg-input",
        true: "bg-primary",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      checked: {
        false: "translate-x-0",
        true: "translate-x-5",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

export const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      ref={ref}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(switchVariants({ checked }), "h-6 w-11", className)}
      {...props}
    >
      <span className={cn(thumbVariants({ checked }), "pointer-events-none")} />
    </button>
  );
});
Switch.displayName = "Switch";
