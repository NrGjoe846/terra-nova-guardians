interface EcoPointsProps {
  points: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EcoPoints = ({ points, showLabel = true, size = "md" }: EcoPointsProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-3xl"
  };

  const iconSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className="flex items-center gap-2 text-primary font-bold cheerful-text">
      <span className={`${iconSizes[size]} animate-sparkle`}>🌟</span>
      <span className={sizeClasses[size]}>
        {points.toLocaleString()}
        {showLabel && " Helper Points"}
      </span>
    </div>
  );
};
