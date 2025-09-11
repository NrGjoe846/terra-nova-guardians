import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, Trophy, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  players: string;
  rewards: {
    ecoPoints: number;
    xp: number;
  };
  element: "forest" | "sky" | "earth" | "river";
  isLocked?: boolean;
  progress?: number;
  onPlay: () => void;
  featured?: boolean;
}

export const GameCard = ({
  title,
  description,
  image,
  difficulty,
  duration,
  players,
  rewards,
  element,
  isLocked = false,
  progress = 0,
  onPlay,
  featured = false
}: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500", 
    hard: "bg-red-500"
  };

  const difficultyIcons = {
    easy: "⭐",
    medium: "⭐⭐",
    hard: "⭐⭐⭐"
  };

  return (
    <ElementalCard 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 cursor-pointer",
        featured && "ring-2 ring-primary shadow-2xl",
        isHovered && "scale-105 shadow-xl",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
      floating={!isLocked}
      glowing={featured}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ 
            backgroundImage: `url(${image})`,
            filter: isLocked ? 'grayscale(100%)' : 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Floating badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={cn("text-white", difficultyColors[difficulty])}>
            {difficultyIcons[difficulty]} {difficulty}
          </Badge>
          {featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse">
              🔥 Featured
            </Badge>
          )}
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-sm">Complete previous games to unlock</p>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {progress > 0 && !isLocked && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/50 rounded-full p-2">
              <Progress value={progress} className="h-2" />
              <p className="text-white text-xs mt-1">{progress}% Complete</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Game stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-muted-foreground" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} className="text-muted-foreground" />
            <span>{players}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={16} className="text-muted-foreground" />
            <span>Rank #1</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <div className="flex items-center gap-1 text-primary">
              <span>🍃</span>
              <span className="font-semibold">{rewards.ecoPoints}</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Star size={14} />
              <span className="font-semibold">{rewards.xp} XP</span>
            </div>
          </div>
          
          <ElementalButton
            element={element}
            onClick={onPlay}
            disabled={isLocked}
            className={cn(
              "px-6 py-2 text-sm transition-all duration-300",
              isHovered && !isLocked && "animate-pulse"
            )}
          >
            {isLocked ? "🔒 Locked" : "Play Now"}
            {!isLocked && <Zap size={16} className="ml-1" />}
          </ElementalButton>
        </div>

        {/* Animated border effect */}
        <div className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
          isHovered && !isLocked && "opacity-100",
          "bg-gradient-to-r from-transparent via-primary/20 to-transparent",
          "animate-pulse"
        )} />
      </div>
    </ElementalCard>
  );
};
