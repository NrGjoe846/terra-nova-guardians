import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface ElementalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  element: "forest" | "sky" | "earth" | "river";
  children: React.ReactNode;
  glowing?: boolean;
}

const ElementalButton = forwardRef<HTMLButtonElement, ElementalButtonProps>(
  ({ element, children, glowing = false, className, ...props }, ref) => {
    const elementStyles = {
      forest: "btn-forest",
      sky: "btn-sky", 
      earth: "btn-earth",
      river: "btn-river"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          elementStyles[element],
          glowing && "animate-pulse-glow",
          "font-semibold text-lg px-8 py-6 rounded-2xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ElementalButton.displayName = "ElementalButton";

export { ElementalButton };