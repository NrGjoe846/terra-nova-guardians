import { useState, useCallback } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Recycle, Trash2, Leaf, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WasteItem {
  id: string;
  name: string;
  category: "paper" | "plastic" | "glass" | "organic";
  icon: React.ReactNode;
}

interface RecycleRushGameProps {
  onGameComplete: (score: number) => void;
}

const wasteItems: WasteItem[] = [
  { id: "1", name: "Newspaper", category: "paper", icon: "📰" },
  { id: "2", name: "Plastic Bottle", category: "plastic", icon: "🍼" },
  { id: "3", name: "Glass Jar", category: "glass", icon: "🫙" },
  { id: "4", name: "Apple Core", category: "organic", icon: "🍎" },
  { id: "5", name: "Cardboard Box", category: "paper", icon: "📦" },
  { id: "6", name: "Plastic Bag", category: "plastic", icon: "🛍️" },
  { id: "7", name: "Wine Bottle", category: "glass", icon: "🍷" },
  { id: "8", name: "Banana Peel", category: "organic", icon: "🍌" },
];

const bins = [
  { 
    category: "paper" as const, 
    name: "Paper Bin", 
    color: "bg-yellow-500", 
    icon: <Recycle className="text-white" />,
    description: "Paper & Cardboard"
  },
  { 
    category: "plastic" as const, 
    name: "Plastic Bin", 
    color: "bg-blue-500", 
    icon: <Droplets className="text-white" />,
    description: "Plastic Items"
  },
  { 
    category: "glass" as const, 
    name: "Glass Bin", 
    color: "bg-green-500", 
    icon: <Trash2 className="text-white" />,
    description: "Glass & Metal"
  },
  { 
    category: "organic" as const, 
    name: "Compost Bin", 
    color: "bg-orange-500", 
    icon: <Leaf className="text-white" />,
    description: "Organic Waste"
  },
];

export const RecycleRushGame = ({ onGameComplete }: RecycleRushGameProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<WasteItem[]>([]);
  const { toast } = useToast();

  const startGame = useCallback(() => {
    const shuffled = [...wasteItems].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setCurrentItem(0);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          onGameComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [score, onGameComplete]);

  const handleBinSelect = useCallback((binCategory: string) => {
    if (!gameActive || currentItem >= shuffledItems.length) return;

    const correct = shuffledItems[currentItem].category === binCategory;
    
    if (correct) {
      setScore(prev => prev + 10);
      toast({
        title: "Correct! 🎉",
        description: `${shuffledItems[currentItem].name} goes in the ${binCategory} bin!`,
      });
    } else {
      toast({
        title: "Oops! 🤔",
        description: `${shuffledItems[currentItem].name} doesn't go there. Try again!`,
        variant: "destructive",
      });
    }

    setCurrentItem(prev => prev + 1);

    if (currentItem + 1 >= shuffledItems.length) {
      setGameActive(false);
      onGameComplete(score + (correct ? 10 : 0));
    }
  }, [gameActive, currentItem, shuffledItems, score, toast, onGameComplete]);

  const progress = shuffledItems.length > 0 ? (currentItem / shuffledItems.length) * 100 : 0;

  return (
    <ElementalCard className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">♻️ Recycle Rush</h2>
        <p className="text-muted-foreground">
          Sort waste items into the correct bins as fast as you can!
        </p>
      </div>

      {!gameActive && currentItem === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-lg">Ready to help Terra Nova by recycling correctly?</p>
          <ElementalButton element="forest" onClick={startGame}>
            Start Game
          </ElementalButton>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Game Stats */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Time: {timeLeft}s
            </Badge>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-3" />

          {/* Current Item */}
          {gameActive && currentItem < shuffledItems.length && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">
                {shuffledItems[currentItem].icon}
              </div>
              <h3 className="text-xl font-semibold">
                {shuffledItems[currentItem].name}
              </h3>
              <p className="text-muted-foreground">
                Which bin does this belong in?
              </p>
            </div>
          )}

          {/* Recycling Bins */}
          <div className="grid grid-cols-2 gap-4">
            {bins.map((bin) => (
              <ElementalButton
                key={bin.category}
                element="forest"
                onClick={() => handleBinSelect(bin.category)}
                disabled={!gameActive}
                className={`h-24 flex-col space-y-2 ${bin.color}`}
              >
                {bin.icon}
                <div className="text-center">
                  <div className="font-semibold">{bin.name}</div>
                  <div className="text-xs opacity-90">{bin.description}</div>
                </div>
              </ElementalButton>
            ))}
          </div>

          {/* Game Over */}
          {!gameActive && currentItem > 0 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Game Complete!</h3>
              <p className="text-lg">Final Score: {score} points</p>
              <ElementalButton element="forest" onClick={startGame}>
                Play Again
              </ElementalButton>
            </div>
          )}
        </div>
      )}
    </ElementalCard>
  );
};