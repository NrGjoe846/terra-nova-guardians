import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  element: "forest" | "sky" | "earth" | "river";
}

export const LevelProgress = ({ 
  currentLevel, 
  currentXP, 
  xpForNextLevel, 
  element 
}: LevelProgressProps) => {
  const percentage = (currentXP / xpForNextLevel) * 100;
  
  const elementColors = {
    forest: "bg-gradient-forest",
    sky: "bg-gradient-sky", 
    earth: "bg-gradient-earth",
    river: "bg-gradient-river"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="text-primary" size={20} />
          <span className="font-semibold text-foreground">
            Level {currentLevel}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-3 bg-muted"
      />
    </div>
  );
};