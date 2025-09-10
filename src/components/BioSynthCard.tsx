import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { forwardRef } from "react";

interface TerraTotCardProps extends React.HTMLAttributes<HTMLDivElement> {
  floating?: boolean;
  glowing?: boolean;
  children: React.ReactNode;
}

const BioSynthCard = forwardRef<HTMLDivElement, TerraTotCardProps>(
  ({ floating = false, glowing = false, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card-terra-tots",
          floating && "bounce-float",
          glowing && "happy-glow",
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
