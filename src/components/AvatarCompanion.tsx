import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AvatarCompanionProps {
  element: "forest" | "sky" | "earth" | "river";
  mood: "happy" | "excited" | "sleeping" | "curious";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const companions = {
  forest: { emoji: "🍃", name: "Leafling" },
  sky: { emoji: "☁️", name: "Cloudwhisper" },
  earth: { emoji: "🪨", name: "Pebbleton" },
  river: { emoji: "💧", name: "Droplet" }
};

export const AvatarCompanion = ({ 
  element, 
  mood, 
  size = "md", 
  onClick 
}: AvatarCompanionProps) => {
  const [animationState, setAnimationState] = useState("idle");
  const companion = companions[element];

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl"
  };

  const moodAnimations = {
    happy: "animate-bounce",
    excited: "animate-pulse",
    sleeping: "animate-[pulse_3s_ease-in-out_infinite]",
    curious: "animate-[float_2s_ease-in-out_infinite]"
  };

  // Random idle animations
  useEffect(() => {
    const interval = setInterval(() => {
      const animations = ["wiggle", "sparkle", "float"];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
      setAnimationState(randomAnimation);
      
      setTimeout(() => setAnimationState("idle"), 1000);
    }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setAnimationState("excited");
    setTimeout(() => setAnimationState("idle"), 1000);
    onClick?.();
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer select-none transition-transform duration-300",
        "hover:scale-110 active:scale-95",
        sizeClasses[size],
        moodAnimations[mood],
        animationState === "wiggle" && "animate-[wiggle_0.5s_ease-in-out]",
        animationState === "sparkle" && "animate-sparkle",
        animationState === "excited" && "animate-[bounce_0.5s_ease-in-out_3]"
      )}
      onClick={handleClick}
      title={`${companion.name} the ${element} companion`}
    >
      <div className="relative">
        {companion.emoji}
        
        {/* Magical aura effect */}
        <div className={cn(
          "absolute inset-0 rounded-full opacity-30 animate-pulse",
          element === "forest" && "bg-primary/20",
          element === "sky" && "bg-accent/20", 
          element === "earth" && "bg-secondary/20",
          element === "river" && "bg-river/20"
        )} />
        
        {/* Sparkle effects */}
        {mood === "excited" && (
          <>
            <div className="absolute -top-1 -right-1 text-xs animate-sparkle">✨</div>
            <div className="absolute -bottom-1 -left-1 text-xs animate-sparkle delay-300">✨</div>
          </>
        )}
      </div>
      
      {/* Companion name tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-card border border-border rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap">
          {companion.name}
        </div>
      </div>
    </div>
  );
};