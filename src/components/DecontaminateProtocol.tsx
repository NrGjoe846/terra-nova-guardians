import { useState, useCallback } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContaminationNode {
  id: string;
  type: "viral" | "toxic" | "radiation" | "corruption";
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  pulsing: boolean;
}

interface DecontaminateProtocolProps {
  onGameComplete: (score: number) => void;
}

const contaminationEmojis = {
  viral: "🦠",
  toxic: "☢️", 
  radiation: "⚡",
  corruption: "💀"
};

export const DecontaminateProtocol = ({ onGameComplete }: DecontaminateProtocolProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [contaminationNodes, setContaminationNodes] = useState<ContaminationNode[]>([]);
  const [cleansedCount, setCleansedCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const { toast } = useToast();

  const generateContamination = useCallback(() => {
    const types: ("viral" | "toxic" | "radiation" | "corruption")[] = ["viral", "toxic", "radiation", "corruption"];
    const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    
    return {
      id: Math.random().toString(36),
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 70 + 15, // 15-85% of container height
      size: sizes[Math.floor(Math.random() * sizes.length)],
      pulsing: Math.random() > 0.6
    };
  }, []);

  const startProtocol = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(45);
    setCleansedCount(0);
    setCombo(0);
    
    // Generate initial contamination
    const initialNodes = Array.from({ length: 12 }, generateContamination);
    setContaminationNodes(initialNodes);

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

    // Spawn new contamination periodically
    const spawner = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance to spawn contamination
        setContaminationNodes(prev => [...prev, generateContamination()]);
      }
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [generateContamination, score, onGameComplete]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (!gameActive) return;

    setContaminationNodes(prev => {
      const node = prev.find(n => n.id === nodeId);
      if (!node) return prev;

      const basePoints = node.size === "large" ? 20 : node.size === "medium" ? 15 : 10;
      const comboMultiplier = Math.min(combo + 1, 5);
      const points = basePoints * comboMultiplier;
      
      setScore(s => s + points);
      setCleansedCount(c => c + 1);
      setCombo(c => c + 1);

      toast({
        title: "Node Decontaminated! 🧹",
        description: `+${points} Bio-Credits (${comboMultiplier}x combo)`,
      });

      // Reset combo after 3 seconds of inactivity
      setTimeout(() => setCombo(0), 3000);

      return prev.filter(n => n.id !== nodeId);
    });
  }, [gameActive, combo, toast]);

  const progress = timeLeft > 0 ? ((45 - timeLeft) / 45) * 100 : 100;

  return (
    <BioSynthCard className="p-6 space-y-6 hud-panel">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary bio-synth-title">🧹 Decontaminate Protocol</h2>
        <p className="text-muted-foreground">
          Purge contamination nodes from the bio-synthetic environment!
        </p>
      </div>

      {!gameActive && cleansedCount === 0 ? (
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <Target className="mx-auto text-primary animate-energy-pulse" size={48} />
            <p className="text-lg holo-text">System contamination detected. Initiating purge protocol.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-semibold holo-text">Target Nodes:</h4>
                <div className="flex gap-2 justify-center">
                  <span>🦠</span><span>☢️</span><span>⚡</span><span>💀</span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold holo-text">Objective:</h4>
                <p className="text-xs">Rapid sequential targeting increases combo multiplier</p>
              </div>
            </div>
          </div>
          <BioSynthButton variant="bio-energy" onClick={startProtocol}>
            Initialize Protocol
          </BioSynthButton>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Game Stats */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-3 py-1 hud-panel">
              Score: {score}
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline" className="hud-panel">
                <CheckCircle size={16} className="mr-1 text-green-500" />
                {cleansedCount}
              </Badge>
              <Badge variant="outline" className="hud-panel">
                <Zap size={16} className="mr-1 text-primary" />
                {combo}x
              </Badge>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1 hud-panel">
              Time: {timeLeft}s
            </Badge>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-3 border border-primary/30" />

          {/* Decontamination Zone */}
          <div className="relative w-full h-80 bg-gradient-to-b from-red-900/20 to-background rounded-xl overflow-hidden border-2 border-destructive/30 circuit-overlay">
            {/* Background contamination effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent animate-circuit-pulse"></div>
            </div>

            {/* Contamination Nodes */}
            {contaminationNodes.map((node) => (
              <div
                key={node.id}
                className={cn(
                  "absolute cursor-pointer transform transition-all duration-300 hover:scale-125 active:scale-95",
                  node.pulsing && "animate-energy-pulse",
                  node.size === "large" && "text-5xl",
                  node.size === "medium" && "text-4xl", 
                  node.size === "small" && "text-3xl"
                )}
                style={{ 
                  left: `${node.x}%`, 
                  top: `${node.y}%`,
                  filter: "drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))"
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                {contaminationEmojis[node.type]}
              </div>
            ))}

            {/* System status overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {gameActive && (
                <div className="absolute top-4 left-4 text-primary font-bold text-lg bg-background/80 rounded-lg px-3 py-1 hud-panel">
                  <AlertTriangle className="inline mr-1" size={16} />
                  DECONTAMINATION ACTIVE
                </div>
              )}
              
              {combo > 1 && (
                <div className="absolute top-4 right-4 text-primary font-bold text-2xl animate-energy-pulse">
                  {combo}x COMBO!
                </div>
              )}
            </div>
          </div>

          {/* Protocol Complete */}
          {!gameActive && cleansedCount > 0 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold holo-text">Decontamination Protocol Complete!</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-500">{cleansedCount}</div>
                  <div className="text-sm text-muted-foreground">Nodes Purged</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{Math.floor(score / cleansedCount) || 0}</div>
                  <div className="text-sm text-muted-foreground">Avg Efficiency</div>
                </div>
              </div>
              <BioSynthButton variant="bio-energy" onClick={startProtocol}>
                Reinitialize Protocol
              </BioSynthButton>
            </div>
          )}
        </div>
      )}
    </BioSynthCard>
  );
};
