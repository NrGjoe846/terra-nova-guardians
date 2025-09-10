import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EcoDroneProps {
  type: "bio-energy" | "aether" | "geo-kinetic" | "hydro-core";
  mood: "active" | "scanning" | "standby" | "alert";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const droneTypes = {
  "bio-energy": { emoji: "🤖", name: "Bio-Drone Alpha", color: "text-primary" },
  "aether": { emoji: "🛸", name: "Aether Scanner", color: "text-accent" },
  "geo-kinetic": { emoji: "⚙️", name: "Geo-Probe Unit", color: "text-secondary" },
  "hydro-core": { emoji: "💧", name: "Hydro-Sensor", color: "text-river" }
};

export const EcoDrone = ({ 
  type, 
  mood, 
  size = "md", 
  onClick 
}: EcoDroneProps) => {
  const [animationState, setAnimationState] = useState("idle");
  const drone = droneTypes[type];

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl", 
    lg: "text-6xl"
  };

  const moodAnimations = {
    active: "animate-energy-pulse",
    scanning: "animate-circuit-pulse",
    standby: "animate-holo-float",
    alert: "animate-neon-flicker"
  };

  // Random system operations
  useEffect(() => {
    const interval = setInterval(() => {
      const operations = ["scan", "process", "transmit"];
      const randomOp = operations[Math.floor(Math.random() * operations.length)];
      setAnimationState(randomOp);
      
      setTimeout(() => setAnimationState("idle"), 1500);
    }, 8000 + Math.random() * 4000); // Random interval between 8-12 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setAnimationState("active");
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
        animationState === "scan" && "animate-hologram-scan",
        animationState === "process" && "animate-data-flow",
        animationState === "active" && "animate-system-boot",
        drone.color
      )}
      onClick={handleClick}
      title={`${drone.name} - Status: ${mood.toUpperCase()}`}
    >
      <div className="relative">
        {drone.emoji}
        
        {/* Holographic aura effect */}
        <div className={cn(
          "absolute inset-0 rounded-full opacity-40 animate-circuit-pulse",
          type === "bio-energy" && "bg-primary/20",
          type === "aether" && "bg-accent/20", 
          type === "geo-kinetic" && "bg-secondary/20",
          type === "hydro-core" && "bg-river/20"
        )} />
        
        {/* System status indicators */}
        {mood === "scanning" && (
          <>
            <div className="absolute -top-1 -right-1 text-xs animate-energy-pulse">⚡</div>
            <div className="absolute -bottom-1 -left-1 text-xs animate-energy-pulse delay-300">💾</div>
          </>
        )}

        {/* Data stream effects */}
        {mood === "active" && (
          <div className="absolute inset-0 border border-primary/50 rounded-full animate-data-flow"></div>
        )}
      </div>
      
      {/* Drone designation tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-card border border-primary/30 rounded-lg px-2 py-1 text-xs font-mono whitespace-nowrap hud-panel">
          {drone.name}
        </div>
      </div>
    </div>
  );
};
