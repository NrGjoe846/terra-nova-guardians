import { Progress } from "@/components/ui/progress";
import { Cpu } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  element: "bio-energy" | "aether" | "geo-kinetic" | "hydro-core";
}

export const LevelProgress = ({ 
  currentLevel, 
  currentXP, 
  xpForNextLevel, 
  element 
}: LevelProgressProps) => {
  const percentage = (currentXP / xpForNextLevel) * 100;
  
  const elementColors = {
    "bio-energy": "bg-gradient-bio-energy",
    "aether": "bg-gradient-aether", 
    "geo-kinetic": "bg-gradient-geo-kinetic",
    "hydro-core": "bg-gradient-hydro-core"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="text-primary animate-circuit-pulse" size={20} />
          <span className="font-semibold text-foreground holo-text">
            Level {currentLevel}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-3 bg-muted border border-primary/30"
      />
    </div>
  );
};
