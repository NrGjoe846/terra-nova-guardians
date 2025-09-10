import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { forwardRef } from "react";

interface BioSynthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  floating?: boolean;
  glowing?: boolean;
  children: React.ReactNode;
}

const BioSynthCard = forwardRef<HTMLDivElement, BioSynthCardProps>(
  ({ floating = false, glowing = false, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card-bio-synth",
          floating && "holo-float",
          glowing && "neon-glow",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

BioSynthCard.displayName = "BioSynthCard";

export { BioSynthCard };
