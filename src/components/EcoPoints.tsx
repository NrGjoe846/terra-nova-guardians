import { Zap } from "lucide-react";

interface EcoPointsProps {
  points: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EcoPoints = ({ points, showLabel = true, size = "md" }: EcoPointsProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-2xl"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className="flex items-center gap-2 text-primary font-semibold holo-text">
      <Zap size={iconSizes[size]} className="text-primary animate-energy-pulse" />
      <span className={sizeClasses[size]}>
        {points.toLocaleString()}
        {showLabel && " Bio-Credits"}
      </span>
    </div>
  );
};
