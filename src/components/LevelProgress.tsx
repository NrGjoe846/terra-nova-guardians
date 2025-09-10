import { Progress } from "@/components/ui/progress";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  element: "sunny" | "sky" | "forest" | "sunset";
}

export const LevelProgress = ({ 
  currentLevel, 
  currentXP, 
  xpForNextLevel, 
  element 
}: LevelProgressProps) => {
  const percentage = (currentXP / xpForNextLevel) * 100;
  
  const elementEmojis = {
    "sunny": "☀️",
    "sky": "☁️", 
    "forest": "🌳",
    "sunset": "🌅"
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">{elementEmojis[element]}</span>
          <span className="font-bold text-foreground cheerful-text">
            Level {currentLevel}
          </span>
        </div>
        <span className="text-sm text-muted-foreground font-semibold">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-4 bg-muted border-2 border-primary/40 rounded-full"
      />
    </div>
  );
};
