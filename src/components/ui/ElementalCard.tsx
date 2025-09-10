import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { forwardRef } from "react";

interface ElementalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  floating?: boolean;
  glowing?: boolean;
  children: React.ReactNode;
}

const ElementalCard = forwardRef<HTMLDivElement, ElementalCardProps>(
  ({ floating = false, glowing = false, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card-elemental",
          floating && "float-gentle",
          glowing && "glow-elemental",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

ElementalCard.displayName = "ElementalCard";

export { ElementalCard };