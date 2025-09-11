import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Timer, Shield, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface WildlifeProtectionGameProps {
  onGameComplete: (points: number) => void;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  habitat: string;
  threat: string;
  conservationAction: string;
  difficulty: number;
  points: number;
}

interface Threat {
  id: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  icon: string;
}

export const WildlifeProtectionGame = ({ onGameComplete }: WildlifeProtectionGameProps) => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "encounter" | "complete">("menu");
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [currentThreat, setCurrentThreat] = useState<Threat | null>(null);
  const [score, setScore] = useState(0);
  const [animalsProtected, setAnimalsProtected] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [reactionTime, setReactionTime] = useState(10);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  const animals: Animal[] = [
    { id: "tiger", name: "Bengal Tiger", emoji: "🐅", habitat: "Forest", threat: "Poaching", conservationAction: "Create protected reserves", difficulty: 3, points: 150 },
    { id: "elephant", name: "African Elephant", emoji: "🐘", habitat: "Savanna", threat: "Habitat Loss", conservationAction: "Establish wildlife corridors", difficulty: 2, points: 120 },
    { id: "panda", name: "Giant Panda", emoji: "🐼", habitat: "Bamboo Forest", threat: "Deforestation", conservationAction: "Plant bamboo forests", difficulty: 2, points: 130 },
    { id: "whale", name: "Blue Whale", emoji: "🐋", habitat: "Ocean", threat: "Ship Strikes", conservationAction: "Create shipping lanes", difficulty: 3, points: 140 },
    { id: "turtle", name: "Sea Turtle", emoji: "🐢", habitat: "Ocean", threat: "Plastic Pollution", conservationAction: "Beach cleanup programs", difficulty: 1, points: 100 },
    { id: "rhino", name: "White Rhino", emoji: "🦏", habitat: "Grassland", threat: "Illegal Hunting", conservationAction: "Anti-poaching patrols", difficulty: 3, points: 160 },
    { id: "orangutan", name: "Orangutan", emoji: "🦧", habitat: "Rainforest", threat: "Palm Oil Plantations", conservationAction: "Sustainable farming", difficulty: 2, points: 125 },
    { id: "polar", name: "Polar Bear", emoji: "🐻‍❄️", habitat: "Arctic", threat: "Climate Change", conservationAction: "Reduce carbon emissions", difficulty: 3, points: 170 },
  ];

  const threats: Threat[] = [
    { id: "poaching", type: "Poaching", description: "Illegal hunting for valuable parts", severity: "high", icon: "🚫" },
    { id: "habitat", type: "Habitat Loss", description: "Natural homes being destroyed", severity: "high", icon: "🏗️" },
    { id: "pollution", type: "Pollution", description: "Toxic substances harming wildlife", severity: "medium", icon: "☠️" },
    { id: "climate", type: "Climate Change", description: "Rising temperatures changing ecosystems", severity: "high", icon: "🌡️" },
    { id: "invasive", type: "Invasive Species", description: "Non-native species disrupting balance", severity: "medium", icon: "🦠" },
    { id: "disease", type: "Disease", description: "Illnesses spreading through populations", severity: "medium", icon: "🦠" },
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === "encounter" && reactionTime > 0) {
      const timer = setTimeout(() => setReactionTime(reactionTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (reactionTime === 0 && gameState === "encounter") {
      missedEncounter();
    }
  }, [gameState, reactionTime]);

  useEffect(() => {
    if (gameState === "playing" && !currentAnimal) {
      generateEncounter();
    }
  }, [gameState, currentAnimal]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setAnimalsProtected([]);
    setTimeLeft(120);
    setStreak(0);
    setLives(3);
    setCurrentAnimal(null);
  };

  const generateEncounter = () => {
    const availableAnimals = animals.filter(animal => !animalsProtected.includes(animal.id));
    if (availableAnimals.length > 0) {
      const randomAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
      const randomThreat = threats[Math.floor(Math.random() * threats.length)];
      setCurrentAnimal(randomAnimal);
      setCurrentThreat(randomThreat);
      setReactionTime(10);
      setGameState("encounter");
    }
  };

  const protectAnimal = (success: boolean) => {
    if (!currentAnimal || !currentThreat) return;

    if (success) {
      const timeBonus = reactionTime * 5;
      const difficultyMultiplier = currentAnimal.difficulty;
      const streakBonus = streak * 10;
      const points = currentAnimal.points + timeBonus + streakBonus;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setAnimalsProtected(prev => [...prev, currentAnimal.id]);
    } else {
      missedEncounter();
    }

    setCurrentAnimal(null);
    setCurrentThreat(null);
    setGameState("playing");
    setTimeout(generateEncounter, 2000);
  };

  const missedEncounter = () => {
    setLives(prev => prev - 1);
    setStreak(0);
    
    if (lives <= 1) {
      endGame();
    } else {
      setCurrentAnimal(null);
      setCurrentThreat(null);
      setGameState("playing");
      setTimeout(generateEncounter, 2000);
    }
  };

  const endGame = () => {
    setGameState("complete");
    const finalPoints = Math.floor(score / 10) + (animalsProtected.length * 20);
    setTimeout(() => onGameComplete(finalPoints), 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  if (gameState === "menu") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Shield className="text-green-500 animate-pulse" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-primary">Wildlife Protection Mission</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Protect endangered animals from various threats! React quickly to conservation challenges 
              and save species from extinction. Every second counts!
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700">🛡️ Mission</h4>
                <p className="text-sm text-green-600">Protect endangered species</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700">⏱️ Time Limit</h4>
                <p className="text-sm text-blue-600">2 minutes</p>
              </div>
            </div>
            <ElementalButton element="forest" onClick={startGame} className="mt-6">
              <Shield className="mr-2" size={20} />
              Start Protection Mission
            </ElementalButton>
          </div>
        </ElementalCard>
      </div>
    );
  }

  if (gameState === "playing") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-6 glass-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="text-primary" size={20} />
                <span className="font-bold text-xl">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={20} />
                <span className="font-bold text-xl">{animalsProtected.length} protected</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <Heart 
                    key={i} 
                    className={cn(
                      "w-5 h-5",
                      i < lives ? "text-red-500 fill-current" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              Streak: {streak}
            </Badge>
          </div>
          <Progress value={(120 - timeLeft) / 120 * 100} className="mb-4" />
        </ElementalCard>

        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="text-6xl animate-bounce">🌿</div>
            <h3 className="text-2xl font-bold">Scanning for Wildlife...</h3>
            <p className="text-muted-foreground">
              Stay alert! An endangered animal might need your help soon.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </ElementalCard>
      </div>
    );
  }

  if (gameState === "encounter") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-6 glass-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500 animate-pulse" size={20} />
              <span className="font-bold text-xl text-red-500">{reactionTime}s</span>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              URGENT!
            </Badge>
          </div>
          <Progress value={(10 - reactionTime) / 10 * 100} className="mb-4 h-3" />
        </ElementalCard>

        {currentAnimal && currentThreat && (
          <ElementalCard className="p-8 text-center glass-card border-red-200 border-2 animate-pulse">
            <div className="space-y-6">
              <div className="text-6xl mb-4">{currentAnimal.emoji}</div>
              <h3 className="text-2xl font-bold text-red-600">EMERGENCY!</h3>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">{currentAnimal.name} in danger!</h4>
                <div className="flex justify-center items-center gap-2 mb-4">
                  <span className="text-2xl">{currentThreat.icon}</span>
                  <Badge variant="outline" className={getSeverityColor(currentThreat.severity)}>
                    {currentThreat.type}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{currentThreat.description}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-700 mb-2">Conservation Action Needed:</h5>
                <p className="text-blue-600">{currentAnimal.conservationAction}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <ElementalButton 
                  element="forest" 
                  onClick={() => protectAnimal(true)}
                  className="animate-bounce"
                >
                  <Shield className="mr-2" size={16} />
                  Protect Now!
                </ElementalButton>
                <ElementalButton 
                  element="earth" 
                  onClick={() => protectAnimal(false)}
                  className="opacity-70"
                >
                  Can't Help
                </ElementalButton>
              </div>

              <div className="text-sm text-muted-foreground">
                Difficulty: {"⭐".repeat(currentAnimal?.difficulty || 1)} | 
                Reward: {currentAnimal?.points} points
              </div>
            </div>
          </ElementalCard>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ElementalCard className="p-8 text-center glass-card">
        <div className="space-y-4">
          <div className="text-6xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-primary">Mission Complete!</h2>
          <div className="space-y-2">
            <p className="text-xl">You protected <span className="font-bold text-green-500">{animalsProtected.length} species</span>!</p>
            <p className="text-muted-foreground">
              Final Score: {score} points with {streak} protection streak!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">🦎 Animals Saved</h4>
              <p className="text-2xl font-bold text-green-600">{animalsProtected.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">🏆 Score</h4>
              <p className="text-2xl font-bold text-blue-600">{score}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {animalsProtected.map((animalId) => {
              const animal = animals.find(a => a.id === animalId);
              return animal ? (
                <Badge key={animalId} variant="outline" className="text-sm">
                  {animal.emoji} {animal.name}
                </Badge>
              ) : null;
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Every species saved helps maintain biodiversity and ecosystem balance!
          </p>
        </div>
      </ElementalCard>
    </div>
  );
};