import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingElement {
  id: string;
  type: "leaf" | "sparkle" | "bubble" | "star";
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface InteractiveBackgroundProps {
  theme?: "forest" | "sky" | "earth" | "river";
  intensity?: "low" | "medium" | "high";
}

export const InteractiveBackground = ({ 
  theme = "forest", 
  intensity = "medium" 
}: InteractiveBackgroundProps) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const elementEmojis = {
    forest: { leaf: "🍃", sparkle: "✨", bubble: "🌿", star: "🌟" },
    sky: { leaf: "☁️", sparkle: "⭐", bubble: "💫", star: "🌙" },
    earth: { leaf: "🍂", sparkle: "💎", bubble: "🪨", star: "⛰️" },
    river: { leaf: "💧", sparkle: "🌊", bubble: "🐟", star: "💙" }
  };

  const intensityConfig = {
    low: { count: 15, speed: 0.5 },
    medium: { count: 25, speed: 1 },
    high: { count: 40, speed: 1.5 }
  };

  useEffect(() => {
    const config = intensityConfig[intensity];
    const newElements: FloatingElement[] = [];

    for (let i = 0; i < config.count; i++) {
      const types: (keyof typeof elementEmojis.forest)[] = ["leaf", "sparkle", "bubble", "star"];
      newElements.push({
        id: `element-${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        speed: (Math.random() * config.speed) + 0.2,
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    setElements(newElements);
  }, [theme, intensity]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElements(prev => prev.map(element => ({
        ...element,
        y: (element.y + element.speed) % 110,
        x: element.x + Math.sin(Date.now() * 0.001 + element.id.length) * 0.1
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const themeGradients = {
    forest: "from-green-50 via-emerald-50 to-green-100",
    sky: "from-blue-50 via-sky-50 to-blue-100", 
    earth: "from-amber-50 via-orange-50 to-amber-100",
    river: "from-cyan-50 via-blue-50 to-cyan-100"
  };

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none overflow-hidden",
      `bg-gradient-to-br ${themeGradients[theme]}`
    )}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>

      {/* Floating elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute transition-all duration-1000 ease-out animate-float"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            opacity: element.opacity,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.002) * 0.1})`,
            filter: `blur(${Math.random() * 1}px)`
          }}
        >
          {elementEmojis[theme][element.type]}
        </div>
      ))}

      {/* Interactive mouse trail */}
      <div
        className="absolute w-32 h-32 rounded-full pointer-events-none transition-all duration-300"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: `radial-gradient(circle, ${theme === 'forest' ? 'rgba(34, 197, 94, 0.1)' : 
            theme === 'sky' ? 'rgba(59, 130, 246, 0.1)' :
            theme === 'earth' ? 'rgba(245, 158, 11, 0.1)' :
            'rgba(6, 182, 212, 0.1)'} 0%, transparent 70%)`,
          transform: 'scale(1.2)',
          animation: 'pulse 2s infinite'
        }}
      />
    </div>
  );
};
