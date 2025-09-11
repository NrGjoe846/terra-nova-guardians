import { useState, useEffect, useCallback } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarCompanion } from "@/components/AvatarCompanion";
import { Home, TreePine, Sparkles, Plus, Sun, Moon, Cloud, Zap, Gift, Star, Heart, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SanctuaryItem {
  id: string;
  name: string;
  type: "plant" | "decoration" | "trophy" | "functional" | "magical";
  emoji: string;
  description: string;
  unlocked: boolean;
  placed: boolean;
  position?: { x: number; y: number };
  level: number;
  maxLevel: number;
  effect?: {
    type: "ecoPoints" | "happiness" | "growth" | "energy";
    value: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface WeatherState {
  type: "sunny" | "rainy" | "cloudy" | "stormy";
  intensity: number;
  duration: number;
}

interface EcoSanctuaryProps {
  playerLevel: number;
  ecoPoints: number;
  achievements: string[];
  onItemPurchase: (itemId: string, cost: number) => void;
  onEcoPointsEarned?: (points: number) => void;
}

export const EcoSanctuary = ({ 
  playerLevel, 
  ecoPoints, 
  achievements,
  onItemPurchase,
  onEcoPointsEarned
}: EcoSanctuaryProps) => {
  const [placementMode, setPlacementMode] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<"dawn" | "day" | "dusk" | "night">("day");
  const [weather, setWeather] = useState<WeatherState>({
    type: "sunny",
    intensity: 0.7,
    duration: 300
  });
  const [sanctuaryLevel, setSanctuaryLevel] = useState(1);
  const [sanctuaryExp, setSanctuaryExp] = useState(0);
  const [companionMood, setCompanionMood] = useState<"happy" | "excited" | "curious" | "sleeping">("happy");
  const { toast } = useToast();

  const [sanctuaryItems, setSanctuaryItems] = useState<SanctuaryItem[]>([
    // Plants
    {
      id: "oak-tree",
      name: "Ancient Oak",
      type: "plant", 
      emoji: "🌳",
      description: "A majestic tree that purifies the air and attracts wildlife",
      unlocked: playerLevel >= 2,
      placed: false,
      level: 1,
      maxLevel: 5,
      effect: { type: "ecoPoints", value: 5 },
      rarity: "common"
    },
    {
      id: "flower-bed",
      name: "Wildflower Meadow",
      type: "plant",
      emoji: "🌺",
      description: "Colorful flowers that attract butterflies and bees",
      unlocked: playerLevel >= 3,
      placed: false,
      level: 1,
      maxLevel: 3,
      effect: { type: "happiness", value: 10 },
      rarity: "common"
    },
    {
      id: "herb-garden",
      name: "Healing Herb Garden",
      type: "plant",
      emoji: "🌿",
      description: "Medicinal herbs that boost companion energy",
      unlocked: playerLevel >= 5,
      placed: false,
      level: 1,
      maxLevel: 4,
      effect: { type: "energy", value: 15 },
      rarity: "rare"
    },
    {
      id: "crystal-tree",
      name: "Crystal Energy Tree",
      type: "magical",
      emoji: "🔮",
      description: "A mystical tree that generates pure elemental energy",
      unlocked: achievements.length >= 8,
      placed: false,
      level: 1,
      maxLevel: 3,
      effect: { type: "ecoPoints", value: 20 },
      rarity: "epic"
    },
    // Decorations
    {
      id: "crystal-fountain",
      name: "Elemental Fountain",
      type: "decoration",
      emoji: "⛲",
      description: "Pure water that sparkles with elemental energy",
      unlocked: ecoPoints >= 500,
      placed: false,
      level: 1,
      maxLevel: 3,
      effect: { type: "growth", value: 25 },
      rarity: "rare"
    },
    {
      id: "wind-chimes",
      name: "Harmony Chimes",
      type: "decoration", 
      emoji: "🎐",
      description: "Chimes that create peaceful melodies",
      unlocked: ecoPoints >= 300,
      placed: false,
      level: 1,
      maxLevel: 2,
      effect: { type: "happiness", value: 8 },
      rarity: "common"
    },
    {
      id: "stone-circle",
      name: "Ancient Stone Circle",
      type: "decoration",
      emoji: "🗿",
      description: "Mysterious stones that amplify elemental power",
      unlocked: playerLevel >= 8,
      placed: false,
      level: 1,
      maxLevel: 3,
      effect: { type: "ecoPoints", value: 12 },
      rarity: "epic"
    },
    // Functional Items
    {
      id: "solar-panel",
      name: "Eco Solar Array",
      type: "functional",
      emoji: "☀️",
      description: "Harnesses solar energy for the sanctuary",
      unlocked: achievements.includes("eco-warrior"),
      placed: false,
      level: 1,
      maxLevel: 4,
      effect: { type: "ecoPoints", value: 8 },
      rarity: "rare"
    },
    {
      id: "compost-bin",
      name: "Magic Compost System",
      type: "functional",
      emoji: "🗂️",
      description: "Transforms waste into fertile soil",
      unlocked: playerLevel >= 4,
      placed: false,
      level: 1,
      maxLevel: 3,
      effect: { type: "growth", value: 15 },
      rarity: "common"
    },
    // Trophies
    {
      id: "eco-trophy",
      name: "Guardian Trophy",
      type: "trophy",
      emoji: "🏆",
      description: "Recognition of your environmental achievements",
      unlocked: achievements.length >= 5,
      placed: false,
      level: 1,
      maxLevel: 1,
      effect: { type: "happiness", value: 30 },
      rarity: "legendary"
    }
  ]);

  const [placedItems, setPlacedItems] = useState<SanctuaryItem[]>([
    {
      id: "starter-plant",
      name: "Guardian Sapling", 
      type: "plant",
      emoji: "🌱",
      description: "Your first plant in Terra Nova",
      unlocked: true,
      placed: true,
      position: { x: 50, y: 60 },
      level: 2,
      maxLevel: 5,
      effect: { type: "ecoPoints", value: 3 },
      rarity: "common"
    }
  ]);

  // Time and weather system
  useEffect(() => {
    const timeInterval = setInterval(() => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) setTimeOfDay("dawn");
      else if (hour >= 8 && hour < 17) setTimeOfDay("day");
      else if (hour >= 17 && hour < 20) setTimeOfDay("dusk");
      else setTimeOfDay("night");

      // Random weather changes
      if (Math.random() < 0.1) { // 10% chance every minute
        const weatherTypes: WeatherState["type"][] = ["sunny", "rainy", "cloudy", "stormy"];
        setWeather(prev => ({
          ...prev,
          type: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
          intensity: Math.random() * 0.5 + 0.5
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(timeInterval);
  }, []);

  // Passive income from sanctuary items
  useEffect(() => {
    const incomeInterval = setInterval(() => {
      let totalIncome = 0;
      placedItems.forEach(item => {
        if (item.effect?.type === "ecoPoints") {
          totalIncome += item.effect.value * item.level;
        }
      });
      
      if (totalIncome > 0 && onEcoPointsEarned) {
        onEcoPointsEarned(totalIncome);
        setSanctuaryExp(prev => prev + totalIncome);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(incomeInterval);
  }, [placedItems, onEcoPointsEarned]);

  // Sanctuary leveling
  useEffect(() => {
    const expNeeded = sanctuaryLevel * 100;
    if (sanctuaryExp >= expNeeded) {
      setSanctuaryLevel(prev => prev + 1);
      setSanctuaryExp(0);
      toast({
        title: "Sanctuary Level Up! 🌟",
        description: `Your sanctuary reached level ${sanctuaryLevel + 1}!`,
      });
    }
  }, [sanctuaryExp, sanctuaryLevel, toast]);

  const handleItemPlace = useCallback((x: number, y: number) => {
    if (!placementMode) return;

    const item = sanctuaryItems.find(i => i.id === placementMode);
    if (!item || !item.unlocked) return;

    const newItem = {
      ...item,
      placed: true,
      position: { x: (x / 400) * 100, y: (y / 300) * 100 }
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSanctuaryItems(prev => prev.filter(i => i.id !== placementMode));
    setPlacementMode(null);
    setSanctuaryExp(prev => prev + 25);

    toast({
      title: "Item Placed! 🌱",
      description: `${item.name} has been added to your sanctuary!`,
    });
  }, [placementMode, sanctuaryItems, toast]);

  const handleItemClick = useCallback((itemId: string) => {
    setSelectedItem(itemId);
    const item = placedItems.find(i => i.id === itemId);
    if (item?.effect) {
      const bonus = Math.floor(Math.random() * 5) + 1;
      if (onEcoPointsEarned) {
        onEcoPointsEarned(bonus);
      }
      toast({
        title: `${item.name} Bonus! ✨`,
        description: `You received ${bonus} extra eco-points!`,
      });
    }
  }, [placedItems, onEcoPointsEarned, toast]);

  const upgradeItem = useCallback((itemId: string) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId && item.level < item.maxLevel) {
        const upgradeCost = item.level * 50;
        if (ecoPoints >= upgradeCost) {
          onItemPurchase(itemId, upgradeCost);
          toast({
            title: "Item Upgraded! ⬆️",
            description: `${item.name} is now level ${item.level + 1}!`,
          });
          return { ...item, level: item.level + 1 };
        } else {
          toast({
            title: "Insufficient Eco-Points",
            description: `Need ${upgradeCost} eco-points to upgrade.`,
            variant: "destructive"
          });
        }
      }
      return item;
    }));
  }, [ecoPoints, onItemPurchase, toast]);

  const getItemCost = (item: SanctuaryItem) => {
    const baseCosts = {
      plant: 50,
      decoration: 100,
      functional: 150,
      magical: 300,
      trophy: 0
    };
    const rarityMultiplier = {
      common: 1,
      rare: 2,
      epic: 3,
      legendary: 5
    };
    return baseCosts[item.type] * rarityMultiplier[item.rarity];
  };

  const getSanctuaryStats = () => {
    let happiness = 0;
    let growth = 0;
    let energy = 0;
    
    placedItems.forEach(item => {
      if (item.effect) {
        switch (item.effect.type) {
          case "happiness":
            happiness += item.effect.value * item.level;
            break;
          case "growth":
            growth += item.effect.value * item.level;
            break;
          case "energy":
            energy += item.effect.value * item.level;
            break;
        }
      }
    });

    return { happiness, growth, energy };
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "dawn": return "🌅";
      case "day": return "☀️";
      case "dusk": return "🌆";
      case "night": return "🌙";
    }
  };

  const getWeatherIcon = () => {
    switch (weather.type) {
      case "sunny": return "☀️";
      case "rainy": return "🌧️";
      case "cloudy": return "☁️";
      case "stormy": return "⛈️";
    }
  };

  const getBackgroundClass = () => {
    const timeClasses = {
      dawn: "from-orange-200 via-pink-200 to-purple-200",
      day: "from-blue-200 via-green-200 to-yellow-200",
      dusk: "from-purple-300 via-pink-300 to-orange-300",
      night: "from-indigo-400 via-purple-400 to-blue-400"
    };
    
    return `bg-gradient-to-br ${timeClasses[timeOfDay]}`;
  };

  const sanctuaryGrowthStage = Math.min(5, Math.floor(placedItems.length / 3) + sanctuaryLevel);
  const stats = getSanctuaryStats();
  const expForNext = sanctuaryLevel * 100;

  return (
    <div className="space-y-6">
      {/* Enhanced Sanctuary Header */}
      <ElementalCard className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="text-primary" size={24} />
              <div>
                <h2 className="text-xl font-bold">Eco-Sanctuary Level {sanctuaryLevel}</h2>
                <p className="text-sm text-muted-foreground">
                  Growth Stage: {sanctuaryGrowthStage}/5 • {placedItems.length} items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg">{getTimeIcon()}</div>
                <div className="text-xs text-muted-foreground capitalize">{timeOfDay}</div>
              </div>
              <div className="text-center">
                <div className="text-lg">{getWeatherIcon()}</div>
                <div className="text-xs text-muted-foreground capitalize">{weather.type}</div>
              </div>
            </div>
          </div>

          {/* Sanctuary XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sanctuary Experience</span>
              <span>{sanctuaryExp}/{expForNext} XP</span>
            </div>
            <Progress value={(sanctuaryExp / expForNext) * 100} className="h-2" />
          </div>

          {/* Sanctuary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Heart className="mx-auto text-red-500 mb-1" size={20} />
              <div className="font-semibold">{stats.happiness}</div>
              <div className="text-xs text-muted-foreground">Happiness</div>
            </div>
            <div className="text-center">
              <Leaf className="mx-auto text-green-500 mb-1" size={20} />
              <div className="font-semibold">{stats.growth}</div>
              <div className="text-xs text-muted-foreground">Growth</div>
            </div>
            <div className="text-center">
              <Zap className="mx-auto text-yellow-500 mb-1" size={20} />
              <div className="font-semibold">{stats.energy}</div>
              <div className="text-xs text-muted-foreground">Energy</div>
            </div>
          </div>
        </div>
      </ElementalCard>

      {/* Enhanced Sanctuary View */}
      <ElementalCard className="p-6">
        <div 
          className={cn(
            "relative w-full h-96 rounded-xl overflow-hidden border-2 border-border cursor-pointer transition-all duration-500",
            getBackgroundClass(),
            placementMode && "border-primary border-dashed",
            weather.type === "rainy" && "animate-pulse"
          )}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleItemPlace(x, y);
          }}
        >
          {/* Dynamic Background Effects */}
          <div className="absolute inset-0 opacity-30">
            {weather.type === "rainy" && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/50 to-blue-300/30 animate-pulse" />
            )}
            {sanctuaryGrowthStage >= 1 && (
              <div className="absolute bottom-0 left-1/4 text-6xl animate-float">🏔️</div>
            )}
            {sanctuaryGrowthStage >= 2 && (
              <div className="absolute top-1/4 right-1/4 text-4xl animate-float" style={{ animationDelay: "1s" }}>☁️</div>
            )}
            {sanctuaryGrowthStage >= 3 && (
              <div className="absolute bottom-1/4 right-1/3 text-5xl animate-float" style={{ animationDelay: "2s" }}>🏞️</div>
            )}
            {sanctuaryGrowthStage >= 4 && (
              <div className="absolute top-1/3 left-1/3 text-3xl animate-sparkle">✨</div>
            )}
            {sanctuaryGrowthStage >= 5 && (
              <div className="absolute top-1/2 left-1/2 text-2xl animate-spin" style={{ animationDuration: "10s" }}>🌟</div>
            )}
          </div>

          {/* Placed Items with Enhanced Interactions */}
          {placedItems.map((item) => (
            <div
              key={`placed-${item.id}`}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
                "hover:scale-125 hover:z-10",
                selectedItem === item.id && "animate-bounce scale-110"
              )}
              style={{ 
                left: `${item.position?.x}%`, 
                top: `${item.position?.y}%` 
              }}
              title={`${item.name} (Level ${item.level}/${item.maxLevel})`}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item.id);
              }}
            >
              <div className="relative">
                <div className="text-4xl filter drop-shadow-lg">
                  {item.emoji}
                </div>
                {/* Level indicator */}
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {item.level}
                </div>
                {/* Effect indicator */}
                {item.effect && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-accent-foreground rounded-full px-1 text-xs">
                      +{item.effect.value * item.level}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Enhanced Companion */}
          <div className="absolute bottom-4 left-4">
            <AvatarCompanion 
              element="forest" 
              mood={companionMood} 
              size="md"
              onClick={() => {
                const moods: ("happy" | "excited" | "curious" | "sleeping")[] = ["happy", "excited", "curious", "sleeping"];
                const newMood = moods[Math.floor(Math.random() * moods.length)];
                setCompanionMood(newMood);
                toast({
                  title: "Companion Interaction! 🐾",
                  description: `Your companion is feeling ${newMood}!`,
                });
              }}
            />
          </div>

          {/* Enhanced UI Overlays */}
          {placementMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/95 rounded-lg px-4 py-2 text-sm font-medium shadow-lg">
              <Plus className="inline mr-1" size={16} />
              Click to place {sanctuaryItems.find(i => i.id === placementMode)?.name}
            </div>
          )}

          <div className="absolute top-4 right-4 bg-background/90 rounded-lg px-3 py-1 space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="font-medium">Stage {sanctuaryGrowthStage}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {timeOfDay} • {weather.type}
            </div>
          </div>

          {/* Weather Effects */}
          {weather.type === "rainy" && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-4 bg-blue-400 opacity-60 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </ElementalCard>

      {/* Item Details Panel */}
      {selectedItem && (
        <ElementalCard className="p-4">
          {(() => {
            const item = placedItems.find(i => i.id === selectedItem);
            if (!item) return null;
            
            const upgradeCost = item.level * 50;
            const canUpgrade = item.level < item.maxLevel && ecoPoints >= upgradeCost;
            
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Level: {item.level}/{item.maxLevel}</div>
                    {item.effect && (
                      <div className="text-sm">
                        Effect: +{item.effect.value * item.level} {item.effect.type}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {canUpgrade && (
                      <ElementalButton
                        element="forest"
                        onClick={() => upgradeItem(item.id)}
                        className="text-sm px-2 py-1"
                      >
                        Upgrade ({upgradeCost} 🌱)
                      </ElementalButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </ElementalCard>
      )}

      {/* Enhanced Sanctuary Shop */}
      <ElementalCard className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Gift className="text-primary" size={20} />
          Sanctuary Shop
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sanctuaryItems.map((item) => {
            const cost = getItemCost(item);
            const canAfford = ecoPoints >= cost;
            
            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200 group",
                  item.unlocked && canAfford 
                    ? "border-primary hover:border-primary/70 cursor-pointer hover:shadow-lg hover:scale-105" 
                    : "border-border opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (item.unlocked && canAfford && item.type !== "trophy") {
                    setPlacementMode(item.id);
                  }
                }}
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center justify-center gap-1">
                      {item.name}
                      <Star 
                        size={12} 
                        className={cn(
                          item.rarity === "legendary" && "text-yellow-500",
                          item.rarity === "epic" && "text-purple-500",
                          item.rarity === "rare" && "text-blue-500",
                          item.rarity === "common" && "text-gray-500"
                        )}
                      />
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {item.effect && (
                    <div className="text-xs bg-accent/20 rounded-lg p-2">
                      <div className="font-medium">Effect:</div>
                      <div>+{item.effect.value} {item.effect.type} per level</div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {!item.unlocked && (
                      <Badge variant="outline" className="text-xs">
                        {item.type === "plant" && `Level ${item.id === "oak-tree" ? 2 : item.id === "flower-bed" ? 3 : 5} Required`}
                        {item.type === "decoration" && `${cost / (cost > 200 ? 5 : 2)} Eco-Points Required`}
                        {item.type === "magical" && "Special Achievement Required"}
                        {item.type === "trophy" && "Complete more achievements"}
                        {item.type === "functional" && "Unlock through gameplay"}
                      </Badge>
                    )}
                    
                    {item.unlocked && item.type !== "trophy" && (
                      <Badge variant={canAfford ? "secondary" : "destructive"} className="text-xs">
                        {cost} Eco-Points
                      </Badge>
                    )}
                    
                    {item.unlocked && item.type === "trophy" && (
                      <Badge variant="secondary" className="text-xs">
                        Achievement Reward
                      </Badge>
                    )}

                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs capitalize",
                        item.rarity === "legendary" && "border-yellow-500 text-yellow-600",
                        item.rarity === "epic" && "border-purple-500 text-purple-600",
                        item.rarity === "rare" && "border-blue-500 text-blue-600",
                        item.rarity === "common" && "border-gray-500 text-gray-600"
                      )}
                    >
                      {item.rarity}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ElementalCard>

      {/* Cancel Placement */}
      {placementMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <ElementalButton
            element="forest"
            onClick={() => setPlacementMode(null)}
          >
            Cancel Placement
          </ElementalButton>
        </div>
      )}
    </div>
  );
};