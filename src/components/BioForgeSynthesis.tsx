import { useState, useCallback } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircuitBoard, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneticFragment {
  id: string;
  type: "bio" | "synth" | "energy" | "data";
  sequence: string;
  x: number;
  y: number;
  connected: boolean;
}

interface BioForgeSynthesisProps {
  onGameComplete: (score: number) => void;
}

const fragmentEmojis = {
  bio: "🧬",
  synth: "⚙️",
  energy: "⚡",
  data: "💾"
};

const fragmentColors = {
  bio: "text-green-400",
  synth: "text-blue-400",
  energy: "text-yellow-400",
  data: "text-purple-400"
};

export const BioForgeSynthesis = ({ onGameComplete }: BioForgeSynthesisProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [fragments, setFragments] = useState<GeneticFragment[]>([]);
  const [selectedFragment, setSelectedFragment] = useState<string | null>(null);
  const [connections, setConnections] = useState<string[]>([]);
  const [synthesizedCount, setSynthesizedCount] = useState(0);
  const { toast } = useToast();

  const generateFragment = useCallback(() => {
    const types: ("bio" | "synth" | "energy" | "data")[] = ["bio", "synth", "energy", "data"];
    const sequences = ["ATCG", "XYZW", "VOLT", "BYTE"];
    
    return {
      id: Math.random().toString(36),
      type: types[Math.floor(Math.random() * types.length)],
      sequence: sequences[Math.floor(Math.random() * sequences.length)],
      x: Math.random() * 70 + 15, // 15-85% of container width
      y: Math.random() * 60 + 20, // 20-80% of container height
      connected: false
    };
  }, []);

  const startSynthesis = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setSynthesizedCount(0);
    setSelectedFragment(null);
    setConnections([]);
    
    // Generate initial fragments
    const initialFragments = Array.from({ length: 16 }, generateFragment);
    setFragments(initialFragments);

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

    return () => {
      clearInterval(timer);
    };
  }, [generateFragment, score, onGameComplete]);

  const handleFragmentClick = useCallback((fragmentId: string) => {
    if (!gameActive) return;

    const fragment = fragments.find(f => f.id === fragmentId);
    if (!fragment || fragment.connected) return;

    if (!selectedFragment) {
      setSelectedFragment(fragmentId);
    } else if (selectedFragment === fragmentId) {
      setSelectedFragment(null);
    } else {
      // Attempt to connect fragments
      const firstFragment = fragments.find(f => f.id === selectedFragment);
      const secondFragment = fragments.find(f => f.id === fragmentId);
      
      if (firstFragment && secondFragment) {
        // Check if fragments are compatible (different types create better synthesis)
        const compatible = firstFragment.type !== secondFragment.type;
        
        if (compatible) {
          const points = 25;
          setScore(s => s + points);
          setSynthesizedCount(c => c + 1);
          
          // Mark fragments as connected
          setFragments(prev => prev.map(f => 
            f.id === selectedFragment || f.id === fragmentId 
              ? { ...f, connected: true }
              : f
          ));
          
          setConnections(prev => [...prev, `${selectedFragment}-${fragmentId}`]);
          
          toast({
            title: "Bio-Synthesis Successful! 🧬",
            description: `+${points} Bio-Credits - Compatible fragments merged!`,
          });
        } else {
          toast({
            title: "Synthesis Failed! ⚠️",
            description: "Incompatible fragment types - try different combinations!",
            variant: "destructive",
          });
        }
        
        setSelectedFragment(null);
      }
    }
  }, [gameActive, fragments, selectedFragment, toast]);

  const progress = timeLeft > 0 ? ((60 - timeLeft) / 60) * 100 : 100;

  return (
    <BioSynthCard className="p-6 space-y-6 hud-panel">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary bio-synth-title">🧬 Bio-Forge Synthesis</h2>
        <p className="text-muted-foreground">
          Connect compatible genetic fragments to synthesize new bio-materials!
        </p>
      </div>

      {!gameActive && synthesizedCount === 0 ? (
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <CircuitBoard className="mx-auto text-primary animate-energy-pulse" size={48} />
            <p className="text-lg holo-text">Bio-Forge systems online. Ready for genetic synthesis.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-semibold holo-text">Fragment Types:</h4>
                <div className="flex gap-2 justify-center">
                  <span className="text-green-400">🧬</span>
                  <span className="text-blue-400">⚙️</span>
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-purple-400">💾</span>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold holo-text">Synthesis Rule:</h4>
                <p className="text-xs">Connect different fragment types for optimal synthesis</p>
              </div>
            </div>
          </div>
          <BioSynthButton variant="geo-kinetic" onClick={startSynthesis}>
            Initialize Bio-Forge
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
                {synthesizedCount}
              </Badge>
              <Badge variant="outline" className="hud-panel">
                <Zap size={16} className="mr-1 text-primary" />
                {fragments.filter(f => !f.connected).length} Active
              </Badge>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1 hud-panel">
              Time: {timeLeft}s
            </Badge>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-3 border border-primary/30" />

          {/* Bio-Forge Chamber */}
          <div className="relative w-full h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden border-2 border-primary/30 circuit-overlay">
            {/* Background synthesis effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-data-flow"></div>
            </div>

            {/* Genetic Fragments */}
            {fragments.map((fragment) => (
              <div
                key={fragment.id}
                className={cn(
                  "absolute cursor-pointer transform transition-all duration-300 hover:scale-125 active:scale-95",
                  "text-4xl",
                  fragmentColors[fragment.type],
                  fragment.connected && "opacity-30 cursor-not-allowed",
                  selectedFragment === fragment.id && "animate-energy-pulse scale-125 neon-glow",
                  !fragment.connected && "animate-holo-float"
                )}
                style={{ 
                  left: `${fragment.x}%`, 
                  top: `${fragment.y}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
                onClick={() => handleFragmentClick(fragment.id)}
                title={`${fragment.type.toUpperCase()} Fragment: ${fragment.sequence}`}
              >
                {fragmentEmojis[fragment.type]}
              </div>
            ))}

            {/* Connection lines */}
            {connections.map((connection, index) => (
              <div
                key={connection}
                className="absolute w-1 bg-primary/60 animate-data-flow"
                style={{
                  // Simple line representation - in a real implementation, you'd calculate actual positions
                  left: '50%',
                  top: '50%',
                  height: '20px',
                  transform: `rotate(${index * 45}deg)`
                }}
              />
            ))}

            {/* System status overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {gameActive && (
                <div className="absolute top-4 left-4 text-primary font-bold text-lg bg-background/80 rounded-lg px-3 py-1 hud-panel">
                  <CircuitBoard className="inline mr-1" size={16} />
                  BIO-FORGE ACTIVE
                </div>
              )}
              
              {selectedFragment && (
                <div className="absolute top-4 right-4 text-accent font-bold text-lg animate-energy-pulse">
                  FRAGMENT SELECTED
                </div>
              )}
            </div>
          </div>

          {/* Synthesis Complete */}
          {!gameActive && synthesizedCount > 0 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold holo-text">Bio-Synthesis Protocol Complete!</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-500">{synthesizedCount}</div>
                  <div className="text-sm text-muted-foreground">Syntheses</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-accent">{Math.floor((synthesizedCount / 8) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
                </div>
              </div>
              <BioSynthButton variant="geo-kinetic" onClick={startSynthesis}>
                Reinitialize Bio-Forge
              </BioSynthButton>
            </div>
          )}
        </div>
      )}
    </BioSynthCard>
  );
};
