import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplets, Timer, Target, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterConservationGameProps {
  onGameComplete: (points: number) => void;
}

interface WaterTask {
  id: string;
  action: string;
  waterSaved: number;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
}

export const WaterConservationGame = ({ onGameComplete }: WaterConservationGameProps) => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "complete">("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentTask, setCurrentTask] = useState<WaterTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  const waterTasks: WaterTask[] = [
    { id: "shower", action: "Take a 5-minute shower instead of 10-minute", waterSaved: 25, difficulty: "easy", icon: "🚿" },
    { id: "teeth", action: "Turn off tap while brushing teeth", waterSaved: 8, difficulty: "easy", icon: "🦷" },
    { id: "dishes", action: "Fill sink instead of running water", waterSaved: 15, difficulty: "medium", icon: "🍽️" },
    { id: "garden", action: "Use drip irrigation for plants", waterSaved: 30, difficulty: "hard", icon: "🌱" },
    { id: "leak", action: "Fix a dripping faucet", waterSaved: 20, difficulty: "medium", icon: "🔧" },
    { id: "toilet", action: "Install water-efficient toilet", waterSaved: 40, difficulty: "hard", icon: "🚽" },
    { id: "car", action: "Use bucket instead of hose for car wash", waterSaved: 35, difficulty: "medium", icon: "🚗" },
    { id: "rain", action: "Collect rainwater for watering", waterSaved: 50, difficulty: "hard", icon: "☔" },
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
    if (gameState === "playing" && !currentTask) {
      generateNewTask();
    }
  }, [gameState, currentTask]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(60);
    setCompletedTasks([]);
    setStreak(0);
    setCurrentTask(null);
  };

  const generateNewTask = () => {
    const availableTasks = waterTasks.filter(task => !completedTasks.includes(task.id));
    if (availableTasks.length > 0) {
      const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
      setCurrentTask(randomTask);
    }
  };

  const completeTask = (success: boolean) => {
    if (!currentTask) return;

    if (success) {
      const points = currentTask.waterSaved * (currentTask.difficulty === "hard" ? 3 : currentTask.difficulty === "medium" ? 2 : 1);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCompletedTasks(prev => [...prev, currentTask.id]);
    } else {
      setStreak(0);
    }

    setCurrentTask(null);
    setTimeout(generateNewTask, 1000);
  };

  const endGame = () => {
    setGameState("complete");
    const finalPoints = Math.floor(score / 10) + (streak * 5);
    setTimeout(() => onGameComplete(finalPoints), 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "hard": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  if (gameState === "menu") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Droplets className="text-blue-500 animate-bounce" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-primary">Water Conservation Challenge</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Help save water by making smart choices! Complete conservation actions within 60 seconds
              to earn points and protect our precious water resources.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700">💧 Goal</h4>
                <p className="text-sm text-blue-600">Save as much water as possible</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700">⏱️ Time Limit</h4>
                <p className="text-sm text-green-600">60 seconds</p>
              </div>
            </div>
            <ElementalButton element="river" onClick={startGame} className="mt-6">
              <Droplets className="mr-2" size={20} />
              Start Conservation Mission
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
                <Target className="text-blue-500" size={20} />
                <span className="font-bold text-xl">{score} L saved</span>
              </div>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              Streak: {streak}
            </Badge>
          </div>
          <Progress value={(60 - timeLeft) / 60 * 100} className="mb-4" />
        </ElementalCard>

        {currentTask && (
          <ElementalCard className="p-8 text-center glass-card">
            <div className="space-y-6">
              <div className="text-6xl mb-4">{currentTask.icon}</div>
              <h3 className="text-2xl font-bold">{currentTask.action}</h3>
              <div className="flex justify-center items-center gap-4">
                <Badge variant="outline" className={getDifficultyColor(currentTask.difficulty)}>
                  {currentTask.difficulty.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-500" size={16} />
                  <span className="font-bold">{currentTask.waterSaved}L saved</span>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <ElementalButton 
                  element="river" 
                  onClick={() => completeTask(true)}
                  className="animate-pulse"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Complete Action
                </ElementalButton>
                <ElementalButton 
                  element="earth" 
                  onClick={() => completeTask(false)}
                  className="opacity-70"
                >
                  Skip
                </ElementalButton>
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
          <div className="text-6xl mb-4">🌊</div>
          <h2 className="text-3xl font-bold text-primary">Mission Complete!</h2>
          <div className="space-y-2">
            <p className="text-xl">You saved <span className="font-bold text-blue-500">{score} liters</span> of water!</p>
            <p className="text-muted-foreground">
              Completed {completedTasks.length} conservation actions with a {streak} action streak!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">💧 Water Saved</h4>
              <p className="text-2xl font-bold text-blue-600">{score}L</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">🎯 Actions</h4>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Every drop counts! Your conservation efforts help protect our planet's most precious resource.
          </p>
        </div>
      </ElementalCard>
    </div>
  );
};