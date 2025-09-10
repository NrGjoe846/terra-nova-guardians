import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface BioSynthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "bio-energy" | "aether" | "geo-kinetic" | "hydro-core";
  children: React.ReactNode;
  glowing?: boolean;
}

const BioSynthButton = forwardRef<HTMLButtonElement, BioSynthButtonProps>(
  ({ variant, children, glowing = false, className, ...props }, ref) => {
    const variantStyles = {
      "bio-energy": "btn-bio-energy",
      "aether": "btn-aether", 
      "geo-kinetic": "btn-geo-kinetic",
      "hydro-core": "btn-hydro-core"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          variantStyles[variant],
          glowing && "animate-energy-pulse",
          "font-semibold text-lg px-8 py-6 rounded-2xl font-mono tracking-wide",
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
