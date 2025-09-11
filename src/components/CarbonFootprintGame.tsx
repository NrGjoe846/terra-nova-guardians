import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TreePine, Timer, TrendingDown, Car, Plane, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarbonFootprintGameProps {
  onGameComplete: (points: number) => void;
}

interface CarbonActivity {
  id: string;
  category: "transport" | "energy" | "food" | "lifestyle";
  activity: string;
  options: {
    id: string;
    choice: string;
    carbonReduction: number;
    explanation: string;
    icon: string;
  }[];
  baseCarbon: number;
  icon: string;
}

export const CarbonFootprintGame = ({ onGameComplete }: CarbonFootprintGameProps) => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "result" | "complete">("menu");
  const [currentActivity, setCurrentActivity] = useState(0);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [dailyFootprint, setDailyFootprint] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [perfectChoices, setPerfectChoices] = useState(0);

  const carbonActivities: CarbonActivity[] = [
    {
      id: "commute",
      category: "transport",
      activity: "Your daily commute to work (10km each way)",
      baseCarbon: 4.6,
      icon: "🚗",
      options: [
        { id: "car", choice: "Drive alone in a gas car", carbonReduction: 0, explanation: "Regular car commute produces about 4.6kg CO2 daily", icon: "🚗" },
        { id: "carpool", choice: "Carpool with 2 others", carbonReduction: 3.1, explanation: "Sharing reduces individual footprint by 67%!", icon: "👥" },
        { id: "transit", choice: "Take public transport", carbonReduction: 3.7, explanation: "Public transit reduces emissions by 80%!", icon: "🚌" },
        { id: "bike", choice: "Bike or walk", carbonReduction: 4.6, explanation: "Zero emissions and great exercise!", icon: "🚴" },
      ]
    },
    {
      id: "energy",
      category: "energy",
      activity: "Powering your home for a day",
      baseCarbon: 12.1,
      icon: "🏠",
      options: [
        { id: "regular", choice: "Standard electricity grid", carbonReduction: 0, explanation: "Average home uses 12.1kg CO2 worth of electricity daily", icon: "⚡" },
        { id: "efficient", choice: "Energy-efficient appliances", carbonReduction: 4.8, explanation: "Efficient appliances cut energy use by 40%!", icon: "💡" },
        { id: "solar", choice: "Solar panels + efficient appliances", carbonReduction: 10.9, explanation: "Solar power is nearly carbon-neutral!", icon: "☀️" },
        { id: "minimal", choice: "Minimal energy use + renewables", carbonReduction: 11.6, explanation: "Conservation + clean energy = maximum impact!", icon: "🌱" },
      ]
    },
    {
      id: "food",
      category: "food",
      activity: "Your meals for today",
      baseCarbon: 6.7,
      icon: "🍽️",
      options: [
        { id: "meat", choice: "Beef and dairy heavy diet", carbonReduction: -2.3, explanation: "High meat consumption increases carbon footprint", icon: "🥩" },
        { id: "mixed", choice: "Balanced omnivore diet", carbonReduction: 0, explanation: "Average diet produces about 6.7kg CO2 daily", icon: "🍖" },
        { id: "reduced", choice: "Mostly plants, some meat", carbonReduction: 3.4, explanation: "Plant-forward diet cuts food emissions by 50%!", icon: "🥗" },
        { id: "plant", choice: "Fully plant-based diet", carbonReduction: 5.4, explanation: "Vegan diet reduces food emissions by 80%!", icon: "🌱" },
      ]
    },
    {
      id: "shopping",
      category: "lifestyle",
      activity: "Weekly shopping and consumption",
      baseCarbon: 8.3,
      icon: "🛍️",
      options: [
        { id: "fast", choice: "Fast fashion and disposable items", carbonReduction: -3.2, explanation: "Fast consumption increases carbon footprint significantly", icon: "👗" },
        { id: "regular", choice: "Regular new purchases", carbonReduction: 0, explanation: "Average consumer lifestyle produces 8.3kg CO2 weekly", icon: "🛒" },
        { id: "mindful", choice: "Buy less, choose quality", carbonReduction: 4.2, explanation: "Conscious consumption cuts emissions by 50%!", icon: "♻️" },
        { id: "secondhand", choice: "Second-hand and repair", carbonReduction: 6.6, explanation: "Circular economy reduces emissions by 80%!", icon: "🔄" },
      ]
    },
    {
      id: "travel",
      category: "transport",
      activity: "Weekend travel plans (200km trip)",
      baseCarbon: 44.0,
      icon: "✈️",
      options: [
        { id: "fly", choice: "Short domestic flight", carbonReduction: -16.0, explanation: "Flying has the highest carbon intensity per km", icon: "✈️" },
        { id: "drive", choice: "Drive alone", carbonReduction: 0, explanation: "200km car trip produces about 44kg CO2", icon: "🚗" },
        { id: "train", choice: "Take the train", carbonReduction: 35.2, explanation: "Trains are 80% more efficient than cars!", icon: "🚄" },
        { id: "staycation", choice: "Local activities instead", carbonReduction: 44.0, explanation: "Exploring locally eliminates travel emissions!", icon: "🏞️" },
      ]
    },
  ];

  useEffect(() => {
    // Calculate initial daily footprint
    const initialFootprint = carbonActivities.reduce((sum, activity) => sum + activity.baseCarbon, 0);
    setDailyFootprint(initialFootprint);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setCurrentActivity(0);
    setTotalCarbonSaved(0);
    setScore(0);
    setSelectedChoice(null);
    setStreakCount(0);
    setPerfectChoices(0);
  };

  const selectChoice = (choiceId: string) => {
    if (selectedChoice) return;
    
    setSelectedChoice(choiceId);
    const activity = carbonActivities[currentActivity];
    const choice = activity.options.find(opt => opt.id === choiceId);
    
    if (choice) {
      const carbonSaved = Math.max(0, choice.carbonReduction);
      setTotalCarbonSaved(prev => prev + carbonSaved);
      
      // Score calculation
      let points = carbonSaved * 10;
      if (choice.carbonReduction === Math.max(...activity.options.map(opt => opt.carbonReduction))) {
        points += 50; // Perfect choice bonus
        setStreakCount(prev => prev + 1);
        setPerfectChoices(prev => prev + 1);
      } else {
        setStreakCount(0);
      }
      
      points += streakCount * 10; // Streak bonus
      setScore(prev => prev + Math.floor(points));
    }
    
    setGameState("result");
  };

  const nextActivity = () => {
    if (currentActivity < carbonActivities.length - 1) {
      setCurrentActivity(prev => prev + 1);
      setSelectedChoice(null);
      setGameState("playing");
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("complete");
    const finalPoints = Math.floor(score / 10) + Math.floor(totalCarbonSaved);
    setTimeout(() => onGameComplete(finalPoints), 1500);
  };

  const getCurrentActivity = () => carbonActivities[currentActivity];
  const getSelectedChoiceData = () => {
    const activity = getCurrentActivity();
    return activity.options.find(opt => opt.id === selectedChoice);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "transport": return <Car className="w-5 h-5" />;
      case "energy": return <Home className="w-5 h-5" />;
      case "food": return "🍽️";
      case "lifestyle": return "🛍️";
      default: return "🌍";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transport": return "text-blue-500";
      case "energy": return "text-yellow-500";
      case "food": return "text-green-500";
      case "lifestyle": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  if (gameState === "menu") {
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="flex justify-center">
              <TreePine className="text-green-500 animate-pulse" size={64} />
            </div>
            <h2 className="text-3xl font-bold text-primary">Carbon Footprint Challenge</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Make daily choices to reduce your carbon footprint! Learn how your decisions 
              impact the environment and discover ways to live more sustainably.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700">🌍 Goal</h4>
                <p className="text-sm text-green-600">Minimize CO2 emissions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700">📊 Scenarios</h4>
                <p className="text-sm text-blue-600">{carbonActivities.length} life choices</p>
              </div>
            </div>
            <ElementalButton element="forest" onClick={startGame} className="mt-6">
              <TreePine className="mr-2" size={20} />
              Start Carbon Challenge
            </ElementalButton>
          </div>
        </ElementalCard>
      </div>
    );
  }

  if (gameState === "playing") {
    const activity = getCurrentActivity();
    return (
      <div className="space-y-6">
        <ElementalCard className="p-6 glass-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="text-green-500" size={20} />
                <span className="font-bold text-xl">{totalCarbonSaved.toFixed(1)}kg CO2 saved</span>
              </div>
              <div className="flex items-center gap-2">
                <TreePine className="text-primary" size={20} />
                <span className="font-bold text-xl">{score} points</span>
              </div>
            </div>
            <Badge variant="secondary">
              {currentActivity + 1}/{carbonActivities.length}
            </Badge>
          </div>
          <Progress value={(currentActivity / carbonActivities.length) * 100} className="mb-4" />
          {streakCount > 0 && (
            <Badge variant="outline" className="mb-4 animate-pulse">
              🔥 Perfect streak: {streakCount}
            </Badge>
          )}
        </ElementalCard>

        <ElementalCard className="p-8 glass-card">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">{activity.icon}</div>
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className={getCategoryColor(activity.category)}>
                  {getCategoryIcon(activity.category)}
                </span>
                <Badge variant="outline" className="capitalize">
                  {activity.category}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">{activity.activity}</h3>
              <p className="text-sm text-muted-foreground">
                Base emissions: {activity.baseCarbon}kg CO2
              </p>
            </div>
            <div className="space-y-3">
              {activity.options.map((option) => (
                <ElementalButton
                  key={option.id}
                  element="forest"
                  onClick={() => selectChoice(option.id)}
                  className="w-full text-left justify-start p-4 h-auto bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <span>{option.choice}</span>
                    </div>
                    <Badge 
                      variant={option.carbonReduction > 0 ? "secondary" : option.carbonReduction < 0 ? "destructive" : "outline"}
                      className="ml-2"
                    >
                      {option.carbonReduction > 0 ? `-${option.carbonReduction.toFixed(1)}` : 
                       option.carbonReduction < 0 ? `+${Math.abs(option.carbonReduction).toFixed(1)}` : '0'}kg CO2
                    </Badge>
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
    const activity = getCurrentActivity();
    const selectedChoiceData = getSelectedChoiceData();
    const isOptimal = selectedChoiceData?.carbonReduction === Math.max(...activity.options.map(opt => opt.carbonReduction));
    
    return (
      <div className="space-y-6">
        <ElementalCard className="p-8 text-center glass-card">
          <div className="space-y-4">
            <div className="text-5xl mb-4">
              {selectedChoiceData?.carbonReduction && selectedChoiceData.carbonReduction > 0 ? "🌱" : 
               selectedChoiceData?.carbonReduction && selectedChoiceData.carbonReduction < 0 ? "💨" : "😐"}
            </div>
            <h3 className="text-2xl font-bold">
              {isOptimal ? "Optimal Choice!" : 
               selectedChoiceData?.carbonReduction && selectedChoiceData.carbonReduction > 0 ? "Good Choice!" : 
               "Consider the Impact"}
            </h3>
            <p className="text-muted-foreground">
              {selectedChoiceData?.explanation}
            </p>
            {selectedChoiceData?.carbonReduction && selectedChoiceData.carbonReduction !== 0 && (
              <div className="flex justify-center items-center gap-2">
                <TrendingDown className={selectedChoiceData.carbonReduction > 0 ? "text-green-500" : "text-red-500"} size={20} />
                <span className="font-bold text-lg">
                  {selectedChoiceData.carbonReduction > 0 ? 
                    `Saved ${selectedChoiceData.carbonReduction.toFixed(1)}kg CO2!` :
                    `Added ${Math.abs(selectedChoiceData.carbonReduction).toFixed(1)}kg CO2`}
                </span>
              </div>
            )}
            <ElementalButton 
              element="forest" 
              onClick={nextActivity}
              className="mt-6"
            >
              {currentActivity < carbonActivities.length - 1 ? "Next Choice" : "See Results"}
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
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-3xl font-bold text-primary">Carbon Challenge Complete!</h2>
          <div className="space-y-2">
            <p className="text-xl">You saved <span className="font-bold text-green-500">{totalCarbonSaved.toFixed(1)}kg</span> of CO2!</p>
            <p className="text-muted-foreground">
              Perfect choices: {perfectChoices}/{carbonActivities.length} | Final Score: {score}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700">🌱 CO2 Saved</h4>
              <p className="text-2xl font-bold text-green-600">{totalCarbonSaved.toFixed(1)}kg</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700">🎯 Score</h4>
              <p className="text-2xl font-bold text-blue-600">{score}</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-yellow-700 mb-2">💡 Climate Impact</h4>
            <p className="text-sm text-yellow-600">
              {totalCarbonSaved > 50 ? "Amazing! Your choices could prevent significant climate impact." :
               totalCarbonSaved > 25 ? "Great work! You're making a real difference." :
               "Every small change helps! Keep making conscious choices."}
            </p>
          </div>
        </div>
      </ElementalCard>
    </div>
  );
};