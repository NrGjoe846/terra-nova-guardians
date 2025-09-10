import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface TerraTotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  element: "sunny" | "sky" | "forest" | "sunset";
  children: React.ReactNode;
  glowing?: boolean;
}

const ElementalButton = forwardRef<HTMLButtonElement, TerraTotButtonProps>(
  ({ element, children, glowing = false, className, ...props }, ref) => {
    const elementStyles = {
      sunny: "btn-sunny",
      sky: "btn-sky", 
      forest: "btn-forest",
      sunset: "btn-sunset"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          elementStyles[element],
          glowing && "animate-sparkle",
          "font-bold text-lg px-8 py-6 rounded-3xl font-sans",
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
