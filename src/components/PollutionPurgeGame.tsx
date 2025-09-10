import { useState, useCallback } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PollutionParticle {
  id: string;
  type: "smog" | "plastic" | "oil" | "toxic";
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  moving: boolean;
}

interface Wildlife {
  id: string;
  type: "fish" | "bird" | "plant";
  x: number;
  y: number;
  protected: boolean;
}

interface PollutionPurgeGameProps {
  onGameComplete: (score: number) => void;
}

export const PollutionPurgeGame = ({ onGameComplete }: PollutionPurgeGameProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pollutionParticles, setPollutionParticles] = useState<PollutionParticle[]>([]);
  const [wildlife, setWildlife] = useState<Wildlife[]>([]);
  const [cleansedCount, setCleansedCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const { toast } = useToast();

  const pollutionEmojis = {
    smog: "💨",
    plastic: "🗂️", 
    oil: "🛢️",
    toxic: "☢️"
  };

  const wildlifeEmojis = {
    fish: "🐟",
    bird: "🐦", 
    plant: "🌱"
  };

  const generatePollution = useCallback(() => {
    const types: ("smog" | "plastic" | "oil" | "toxic")[] = ["smog", "plastic", "oil", "toxic"];
    const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    
    return {
      id: Math.random().toString(36),
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 70 + 15, // 15-85% of container height
      size: sizes[Math.floor(Math.random() * sizes.length)],
      moving: Math.random() > 0.5
    };
  }, []);

  const generateWildlife = useCallback(() => {
    const types: ("fish" | "bird" | "plant")[] = ["fish", "bird", "plant"];
    
    return {
      id: Math.random().toString(36),
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      protected: true
    };
  }, []);

  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setCleansedCount(0);
    setMistakesCount(0);
    
    // Generate initial pollution and wildlife
    const initialPollution = Array.from({ length: 8 }, generatePollution);
    const initialWildlife = Array.from({ length: 4 }, generateWildlife);
    
    setPollutionParticles(initialPollution);
    setWildlife(initialWildlife);

    // Game timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          onGameComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn new pollution periodically
    const spawner = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to spawn pollution
        setPollutionParticles(prev => [...prev, generatePollution()]);
      }
      if (Math.random() > 0.7) { // 30% chance to spawn wildlife
        setWildlife(prev => [...prev, generateWildlife()]);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [generatePollution, generateWildlife, score, onGameComplete]);

  const handlePollutionClick = useCallback((particleId: string) => {
    if (!gameActive) return;

    setPollutionParticles(prev => {
      const particle = prev.find(p => p.id === particleId);
      if (!particle) return prev;

      const points = particle.size === "large" ? 15 : particle.size === "medium" ? 10 : 5;
      setScore(s => s + points);
      setCleansedCount(c => c + 1);

      toast({
        title: "Pollution Cleansed! 🧹",
        description: `+${points} points`,
      });

      return prev.filter(p => p.id !== particleId);
    });
  }, [gameActive, toast]);

  const handleWildlifeClick = useCallback((wildlifeId: string) => {
    if (!gameActive) return;

    setWildlife(prev => prev.filter(w => w.id !== wildlifeId));
    setMistakesCount(m => m + 1);
    setScore(s => Math.max(0, s - 10));

    toast({
      title: "Oops! Protected Wildlife! 🐦",
      description: "Be careful not to harm the creatures you're protecting (-10 points)",
      variant: "destructive",
    });
  }, [gameActive, toast]);

  const progress = timeLeft > 0 ? ((60 - timeLeft) / 60) * 100 : 100;

  return (
    <ElementalCard className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">💨 Pollution Purge</h2>
        <p className="text-muted-foreground">
          Clean up the polluted area by tapping pollution! Avoid the wildlife!
        </p>
      </div>

      {!gameActive && cleansedCount === 0 ? (
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <Trash2 className="mx-auto text-primary" size={48} />
            <p className="text-lg">The Terra Nova ecosystem needs your help!</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-semibold">Target (Tap These):</h4>
                <div className="flex gap-2 justify-center">
                  <span>💨</span><span>🗂️</span><span>🛢️</span><span>☢️</span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Protect (Don't Tap):</h4>
                <div className="flex gap-2 justify-center">
                  <span>🐟</span><span>🐦</span><span>🌱</span>
                </div>
              </div>
            </div>
          </div>
          <ElementalButton element="earth" onClick={startGame}>
            Start Cleanup Mission
          </ElementalButton>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Game Stats */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline">
                <CheckCircle size={16} className="mr-1 text-green-500" />
                {cleansedCount}
              </Badge>
              <Badge variant="outline">
                <AlertCircle size={16} className="mr-1 text-red-500" />
                {mistakesCount}
              </Badge>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Time: {timeLeft}s
            </Badge>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-3" />

          {/* Game Area */}
          <div className="relative w-full h-80 bg-gradient-to-b from-sky-200 to-green-200 rounded-xl overflow-hidden border-2 border-border">
            {/* Background environment */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-400 to-transparent"></div>
              <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-blue-300 to-transparent"></div>
            </div>

            {/* Pollution Particles */}
            {pollutionParticles.map((particle) => (
              <div
                key={particle.id}
                className={cn(
                  "absolute cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95",
                  particle.moving && "animate-float",
                  particle.size === "large" && "text-4xl",
                  particle.size === "medium" && "text-3xl", 
                  particle.size === "small" && "text-2xl"
                )}
                style={{ 
                  left: `${particle.x}%`, 
                  top: `${particle.y}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
                onClick={() => handlePollutionClick(particle.id)}
              >
                {pollutionEmojis[particle.type]}
              </div>
            ))}

            {/* Wildlife */}
            {wildlife.map((animal) => (
              <div
                key={animal.id}
                className="absolute cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 text-3xl animate-bounce"
                style={{ 
                  left: `${animal.x}%`, 
                  top: `${animal.y}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: "2s"
                }}
                onClick={() => handleWildlifeClick(animal.id)}
              >
                {wildlifeEmojis[animal.type]}
              </div>
            ))}

            {/* Visual effects overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {gameActive && (
                <div className="absolute top-4 left-4 text-white font-bold text-lg bg-black/50 rounded-lg px-3 py-1">
                  <Zap className="inline mr-1" size={16} />
                  Cleanup in Progress
                </div>
              )}
            </div>
          </div>

          {/* Game Over */}
          {!gameActive && cleansedCount > 0 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Cleanup Mission Complete!</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-500">{cleansedCount}</div>
                  <div className="text-sm text-muted-foreground">Pollution Cleaned</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-500">{wildlife.length + mistakesCount}</div>
                  <div className="text-sm text-muted-foreground">Wildlife Protected</div>
                </div>
              </div>
              <ElementalButton element="earth" onClick={startGame}>
                Start New Mission
              </ElementalButton>
            </div>
          )}
        </div>
      )}
    </ElementalCard>
  );
};