import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Timer, TrendingDown, Lightbulb, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnergyEfficiencyGameProps {
  onGameComplete: (points: number) => void;
}

interface EnergyChoice {
  id: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    energySaved: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  category: "lighting" | "heating" | "appliances" | "electronics";
  icon: string;
}

export const EnergyEfficiencyGame = ({ onGameComplete }: EnergyEfficiencyGameProps) => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "result" | "complete">("menu");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [energySaved, setEnergySaved] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streakCount, setStreakCount] = useState(0);

  const energyChoices: EnergyChoice[] = [
    {
      id: "lighting1",
      scenario: "You're leaving a room for 30 minutes. What's the best choice?",
      category: "lighting",
      icon: "💡",
      options: [
        { id: "a", text: "Leave lights on", energySaved: 0, isCorrect: false, explanation: "Leaving lights on wastes energy unnecessarily." },
        { id: "b", text: "Turn off all lights", energySaved: 15, isCorrect: true, explanation: "Turning off lights saves 15W per hour!" },
        { id: "c", text: "Dim the lights", energySaved: 5, isCorrect: false, explanation: "Dimming helps but turning off is better for short periods." },
      ]
    },
    {
      id: "heating1",
      scenario: "It's winter and you want to save energy while staying warm. Best option?",
      category: "heating",
      icon: "🏠",
      options: [
        { id: "a", text: "Heat the whole house to 25°C", energySaved: 0, isCorrect: false, explanation: "Heating the entire house to high temperatures wastes lots of energy." },
        { id: "b", text: "Wear warmer clothes and heat to 20°C", energySaved: 40, isCorrect: true, explanation: "Lowering temperature by 5°C can save 40% on heating!" },
        { id: "c", text: "Use space heaters in every room", energySaved: -20, isCorrect: false, explanation: "Multiple space heaters use more energy than central heating." },
      ]
    },
    {
      id: "appliances1",
      scenario: "You need to wash a small load of clothes. What's most efficient?",
      category: "appliances",
      icon: "👕",
      options: [
        { id: "a", text: "Use hot water wash", energySaved: 0, isCorrect: false, explanation: "Hot water uses significantly more energy." },
        { id: "b", text: "Wait to collect a full load and use cold water", energySaved: 50, isCorrect: true, explanation: "Full loads and cold water save up to 50% energy!" },
        { id: "c", text: "Hand wash everything", energySaved: 30, isCorrect: false, explanation: "Hand washing saves energy but full machine loads are more efficient." },
      ]
    },
    {
      id: "electronics1",
      scenario: "Your TV and gaming console aren't being used. Best practice?",
      category: "electronics",
      icon: "📺",
      options: [
        { id: "a", text: "Leave them on standby mode", energySaved: 5, isCorrect: false, explanation: "Standby mode still consumes energy continuously." },
        { id: "b", text: "Turn them off completely", energySaved: 25, isCorrect: true, explanation: "Completely powering off eliminates phantom power draw!" },
        { id: "c", text: "Just turn off the screen", energySaved: 10, isCorrect: false, explanation: "The device still consumes power even with screen off." },
      ]
    },
    {
      id: "lighting2",
      scenario: "You're replacing old light bulbs. Which is the most energy-efficient?",
      category: "lighting",
      icon: "🔆",
      options: [
        { id: "a", text: "Incandescent bulbs", energySaved: 0, isCorrect: false, explanation: "Incandescent bulbs are the least efficient option." },
        { id: "b", text: "CFL bulbs", energySaved: 60, isCorrect: false, explanation: "CFLs are efficient but LEDs are even better." },
        { id: "c", text: "LED bulbs", energySaved: 80, isCorrect: true, explanation: "LEDs use 80% less energy than incandescent bulbs!" },
      ]
    },
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      handleTimeUp();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setEnergySaved(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setStreakCount(0);
  };

  const handleTimeUp = () => {
    setStreakCount(0);
    if (currentQuestion < energyChoices.length - 1) {
      nextQuestion();
    } else {
      endGame();
    }
  };

  const selectOption = (optionId: string) => {
    if (selectedOption) return;
    
    setSelectedOption(optionId);
    const currentChoice = energyChoices[currentQuestion];
    const option = currentChoice.options.find(opt => opt.id === optionId);
    
    if (option) {
      if (option.isCorrect) {
        const points = 100 + (timeLeft * 5) + (streakCount * 10);
        setScore(prev => prev + points);
        setStreakCount(prev => prev + 1);
      } else {
        setStreakCount(0);
      }
      setEnergySaved(prev => prev + Math.max(0, option.energySaved));
    }
    
    setGameState("result");
  };

  const nextQuestion = () => {
    if (currentQuestion < energyChoices.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(15);
      setGameState("playing");
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("complete");
    const finalPoints = Math.floor(score / 10) + energySaved;
    setTimeout(() => onGameComplete(finalPoints), 1500);
  };

  const getCurrentChoice = () => energyChoices[currentQuestion];
  const getSelectedOptionData = () => {
    const choice = getCurrentChoice();
    return choice.options.find(opt => opt.id === selectedOption);
  };

  if (gameState === "menu") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Zap className="text-yellow-500 animate-pulse" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-primary">Energy Efficiency Challenge</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Make smart energy choices to reduce your carbon footprint! 
              Answer questions about energy efficiency and learn how to save power.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-700">⚡ Goal</h4>
                <p className="text-sm text-yellow-600">Maximize energy savings</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700">🎯 Questions</h4>
                <p className="text-sm text-green-600">{energyChoices.length} scenarios</p>
              </div>
            </div>
            <ElementalButton element="sky" onClick={startGame} className="mt-6">
              <Zap className="mr-2" size={20} />
              Start Energy Challenge
            </ElementalButton>
          </div>
        </ElementalCard>
      </div>
    );
  }

  if (gameState === "playing") {
    const choice = getCurrentChoice();
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
                <TrendingDown className="text-green-500" size={20} />
                <span className="font-bold text-xl">{energySaved}W saved</span>
              </div>
            </div>
            <Badge variant="secondary">
              Question {currentQuestion + 1}/{energyChoices.length}
            </Badge>
          </div>
          <Progress value={(currentQuestion / energyChoices.length) * 100} className="mb-4" />
          {streakCount > 0 && (
            <Badge variant="outline" className="mb-4 animate-pulse">
              🔥 Streak: {streakCount}
            </Badge>
          )}
        </ElementalCard>

        <ElementalCard className="p-8 glass-card">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">{choice.icon}</div>
              <Badge variant="outline" className="mb-4 capitalize">
                {choice.category}
              </Badge>
              <h3 className="text-xl font-bold mb-6">{choice.scenario}</h3>
            </div>
            <div className="space-y-3">
              {choice.options.map((option) => (
                <ElementalButton
                  key={option.id}
                  element="forest"
                  onClick={() => selectOption(option.id)}
                  className="w-full text-left justify-start p-4 h-auto bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.text}</span>
                    {option.energySaved > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        +{option.energySaved}W
                      </Badge>
                    )}
                  </div>
                </ElementalButton>
              ))}
            </div>
          </div>
        </ElementalCard>
      </div>
    );
  }

  if (gameState === "result") {
    const choice = getCurrentChoice();
    const selectedOptionData = getSelectedOptionData();
    
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="text-5xl mb-4">
              {selectedOptionData?.isCorrect ? "✅" : "❌"}
            </div>
            <h3 className="text-2xl font-bold">
              {selectedOptionData?.isCorrect ? "Excellent Choice!" : "Not Quite Right"}
            </h3>
            <p className="text-muted-foreground">
              {selectedOptionData?.explanation}
            </p>
            {selectedOptionData?.energySaved && selectedOptionData.energySaved > 0 && (
              <div className="flex justify-center items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                <span className="font-bold text-lg">+{selectedOptionData.energySaved}W saved!</span>
              </div>
            )}
            <ElementalButton 
              element="sky" 
              onClick={nextQuestion}
              className="mt-6"
            >
              {currentQuestion < energyChoices.length - 1 ? "Next Question" : "See Results"}
            </ElementalButton>
          </div>
        </ElementalCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ElementalCard className="p-8 text-center glass-card">
        <div className="space-y-4">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold text-primary">Energy Challenge Complete!</h2>
          <div className="space-y-2">
            <p className="text-xl">You saved <span className="font-bold text-green-500">{energySaved} watts</span> of energy!</p>
            <p className="text-muted-foreground">
              Final Score: {score} points with {streakCount} correct streak!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-700">⚡ Energy Saved</h4>
              <p className="text-2xl font-bold text-yellow-600">{energySaved}W</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">🎯 Score</h4>
              <p className="text-2xl font-bold text-green-600">{score}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Every watt saved helps reduce carbon emissions and protects our environment!
          </p>
        </div>
      </ElementalCard>
    </div>
  );
};