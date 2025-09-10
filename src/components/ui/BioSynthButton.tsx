import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface TerraTotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "sunny" | "sky" | "forest" | "sunset";
  children: React.ReactNode;
  glowing?: boolean;
}

const BioSynthButton = forwardRef<HTMLButtonElement, TerraTotButtonProps>(
  ({ variant, children, glowing = false, className, ...props }, ref) => {
    const variantStyles = {
      "sunny": "btn-sunny",
      "sky": "btn-sky", 
      "forest": "btn-forest",
      "sunset": "btn-sunset"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          variantStyles[variant],
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

BioSynthButton.displayName = "BioSynthButton";

export { BioSynthButton };
