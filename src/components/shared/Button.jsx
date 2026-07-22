import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-subtle",
  ghost: "text-foreground hover:bg-muted",
  outline: "hairline bg-transparent text-foreground hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

/**
 * Editorial button primitive. Sharp corners, hairline borders, no shadows.
 * Use `variant` for intent and `size` for scale.
 */
export const Button = forwardRef(function Button(
  { as: As = "button", variant = "primary", size = "md", className, children, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-[6px] font-medium transition-[background,opacity,color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
});
