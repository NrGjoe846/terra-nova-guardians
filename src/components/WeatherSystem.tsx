import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Zap } from "lucide-react";

interface WeatherCondition {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  effects: {
    ecoPointsMultiplier: number;
    xpMultiplier: number;
    specialBonus?: string;
  };
  rarity: "common" | "uncommon" | "rare" | "legendary";
}

interface WeatherSystemProps {
  onWeatherChange: (weather: WeatherCondition) => void;
}

export const WeatherSystem = ({ onWeatherChange }: WeatherSystemProps) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null);
  const [timeUntilChange, setTimeUntilChange] = useState(300); // 5 minutes

  const weatherConditions: WeatherCondition[] = [
    {
      id: "sunny",
      name: "Sunny Skies",
      icon: <Sun className="text-yellow-500" size={24} />,
      description: "Perfect weather for outdoor activities",
      effects: {
        ecoPointsMultiplier: 1.2,
        xpMultiplier: 1.1,
        specialBonus: "Quiz answers give bonus XP"
      },
      rarity: "common"
    },
    {
      id: "cloudy",
      name: "Cloudy Day",
      icon: <Cloud className="text-gray-500" size={24} />,
      description: "Overcast skies provide calm energy",
      effects: {
        ecoPointsMultiplier: 1.0,
        xpMultiplier: 1.0
      },
      rarity: "common"
    },
    {
      id: "rainy",
      name: "Gentle Rain",
      icon: <CloudRain className="text-blue-500" size={24} />,
      description: "Refreshing rain nourishes the earth",
      effects: {
        ecoPointsMultiplier: 1.3,
        xpMultiplier: 1.0,
        specialBonus: "Sanctuary plants grow faster"
      },
      rarity: "uncommon"
    },
    {
      id: "windy",
      name: "Breezy Winds",
      icon: <Wind className="text-green-500" size={24} />,
      description: "Strong winds carry elemental energy",
      effects: {
        ecoPointsMultiplier: 1.1,
        xpMultiplier: 1.3,
        specialBonus: "Mini-games give bonus XP"
      },
      rarity: "uncommon"
    },
    {
      id: "snowy",
      name: "Magical Snow",
      icon: <CloudSnow className="text-blue-200" size={24} />,
      description: "Rare crystalline snow with magical properties",
      effects: {
        ecoPointsMultiplier: 1.5,
        xpMultiplier: 1.2,
        specialBonus: "All rewards doubled"
      },
      rarity: "rare"
    },
    {
      id: "aurora",
      name: "Aurora Borealis",
      icon: <Zap className="text-purple-500" size={24} />,
      description: "Mystical aurora lights dance across Terra Nova",
      effects: {
        ecoPointsMultiplier: 2.0,
        xpMultiplier: 2.0,
        specialBonus: "Legendary companion evolution chance"
      },
      rarity: "legendary"
    }
  ];

  const getWeatherByRarity = () => {
    const rand = Math.random();
    let targetRarity: "common" | "uncommon" | "rare" | "legendary";
    
    if (rand < 0.6) targetRarity = "common";
    else if (rand < 0.85) targetRarity = "uncommon";
    else if (rand < 0.98) targetRarity = "rare";
    else targetRarity = "legendary";
    
    const availableWeather = weatherConditions.filter(w => w.rarity === targetRarity);
    return availableWeather[Math.floor(Math.random() * availableWeather.length)];
  };

  const changeWeather = () => {
    const newWeather = getWeatherByRarity();
    setCurrentWeather(newWeather);
    setTimeUntilChange(300 + Math.random() * 300); // 5-10 minutes
    onWeatherChange(newWeather);
  };

  useEffect(() => {
    // Set initial weather
    changeWeather();
    
    const timer = setInterval(() => {
      setTimeUntilChange(prev => {
        if (prev <= 1) {
          changeWeather();
          return 300 + Math.random() * 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-400 bg-gray-50";
      case "uncommon": return "border-green-400 bg-green-50";
      case "rare": return "border-blue-400 bg-blue-50";
      case "legendary": return "border-purple-400 bg-purple-50 animate-pulse";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  if (!currentWeather) return null;

  return (
    <ElementalCard className={`p-4 ${getRarityColor(currentWeather.rarity)}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentWeather.icon}
            <div>
              <h3 className="font-bold text-lg">{currentWeather.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentWeather.description}
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="capitalize">
            {currentWeather.rarity}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Eco-Points:</span>
              <span className="font-semibold text-primary">
                +{Math.round((currentWeather.effects.ecoPointsMultiplier - 1) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>XP Bonus:</span>
              <span className="font-semibold text-accent">
                +{Math.round((currentWeather.effects.xpMultiplier - 1) * 100)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Changes in:</div>
            <div className="font-mono text-lg font-bold">
              {formatTime(timeUntilChange)}
            </div>
          </div>
        </div>

        {currentWeather.effects.specialBonus && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <div className="text-xs font-semibold text-primary">Special Effect:</div>
            <div className="text-sm">{currentWeather.effects.specialBonus}</div>
          </div>
        )}
      </div>
    </ElementalCard>
  );
};
