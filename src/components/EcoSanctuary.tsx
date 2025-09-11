import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { AvatarCompanion } from "@/components/AvatarCompanion";
import { Home, TreePine, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SanctuaryItem {
  id: string;
  name: string;
  type: "plant" | "decoration" | "trophy";
  emoji: string;
  description: string;
  unlocked: boolean;
  placed: boolean;
  position?: { x: number; y: number };
}

interface EcoSanctuaryProps {
  playerLevel: number;
  ecoPoints: number;
  achievements: string[];
  onItemPurchase: (itemId: string, cost: number) => void;
}

export const EcoSanctuary = ({ 
  playerLevel, 
  ecoPoints, 
  achievements,
  onItemPurchase 
}: EcoSanctuaryProps) => {
  const [placementMode, setPlacementMode] = useState<string | null>(null);
  const [sanctuaryItems, setSanctuaryItems] = useState<SanctuaryItem[]>([
    {
      id: "oak-tree",
      name: "Ancient Oak",
      type: "plant", 
      emoji: "🌳",
      description: "A majestic tree that grows with your wisdom",
      unlocked: playerLevel >= 2,
      placed: false
    },
    {
      id: "flower-bed",
      name: "Wildflower Bed",
      type: "plant",
      emoji: "🌺",
      description: "Colorful flowers that attract virtual butterflies",
      unlocked: playerLevel >= 3,
      placed: false
    },
    {
      id: "crystal-fountain",
      name: "Crystal Fountain",
      type: "decoration",
      emoji: "⛲",
      description: "Pure water that sparkles with elemental energy",
      unlocked: ecoPoints >= 500,
      placed: false
    },
    {
      id: "eco-trophy",
      name: "Guardian Trophy",
      type: "trophy",
      emoji: "🏆",
      description: "Recognition of your environmental achievements",
      unlocked: achievements.length >= 5,
      placed: false
    },
    {
      id: "herb-garden",
      name: "Herb Garden",
      type: "plant",
      emoji: "🌿",
      description: "Medicinal herbs that boost companion energy",
      unlocked: playerLevel >= 5,
      placed: false
    },
    {
      id: "wind-chimes",
      name: "Elemental Chimes",
      type: "decoration", 
      emoji: "🎐",
      description: "Chimes that sing with the voices of the elements",
      unlocked: ecoPoints >= 300,
      placed: false
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
      position: { x: 50, y: 60 }
    }
  ]);

  const handleItemPlace = (x: number, y: number) => {
    if (!placementMode) return;

    const item = sanctuaryItems.find(i => i.id === placementMode);
    if (!item || !item.unlocked) return;

    const newItem = {
      ...item,
      placed: true,
      position: { x: (x / 400) * 100, y: (y / 300) * 100 } // Convert to percentage
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSanctuaryItems(prev => prev.filter(i => i.id !== placementMode));
    setPlacementMode(null);
  };

  const getItemCost = (item: SanctuaryItem) => {
    switch (item.type) {
      case "plant": return 50;
      case "decoration": return 100;
      case "trophy": return 0; // Trophies are earned, not bought
      default: return 75;
    }
  };

  const sanctuaryGrowthStage = Math.min(4, Math.floor(placedItems.length / 2));
  const backgroundClass = [
    "from-green-100 to-green-200", // Stage 0: Basic
    "from-green-200 to-green-300", // Stage 1: Growing
    "from-green-300 to-emerald-300", // Stage 2: Flourishing  
    "from-emerald-300 to-emerald-400", // Stage 3: Thriving
    "from-emerald-400 to-emerald-500"  // Stage 4: Paradise
  ][sanctuaryGrowthStage];

  return (
    <div className="space-y-6">
      {/* Sanctuary Header */}
      <ElementalCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="text-primary" size={24} />
            <div>
              <h2 className="text-xl font-bold">Your Eco-Sanctuary</h2>
              <p className="text-sm text-muted-foreground">
                Growth Stage: {sanctuaryGrowthStage + 1}/5
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TreePine className="text-accent" size={20} />
            <span className="font-semibold">{placedItems.length} items</span>
          </div>
        </div>
      </ElementalCard>

      {/* Sanctuary View */}
      <ElementalCard className="p-6">
        <div 
          className={cn(
            "relative w-full h-80 rounded-xl overflow-hidden border-2 border-border cursor-pointer",
            `bg-gradient-to-br ${backgroundClass}`,
            placementMode && "border-primary border-dashed"
          )}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleItemPlace(x, y);
          }}
        >
          {/* Background elements based on growth */}
          <div className="absolute inset-0 opacity-20">
            {sanctuaryGrowthStage >= 1 && (
              <div className="absolute bottom-0 left-1/4 text-6xl">🏔️</div>
            )}
            {sanctuaryGrowthStage >= 2 && (
              <div className="absolute top-1/4 right-1/4 text-4xl animate-float">☁️</div>
            )}
            {sanctuaryGrowthStage >= 3 && (
              <div className="absolute bottom-1/4 right-1/3 text-5xl">🏞️</div>
            )}
            {sanctuaryGrowthStage >= 4 && (
              <div className="absolute top-1/3 left-1/3 text-3xl animate-sparkle">✨</div>
            )}
          </div>

          {/* Placed Items */}
          {placedItems.map((item) => (
            <div
              key={`placed-${item.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in cursor-pointer"
              style={{ 
                left: `${item.position?.x}%`, 
                top: `${item.position?.y}%` 
              }}
              title={item.name}
            >
              <div className="text-4xl hover:scale-110 transition-transform duration-200">
                {item.emoji}
              </div>
            </div>
          ))}

          {/* Companion in sanctuary */}
          <div className="absolute bottom-4 left-4">
            <AvatarCompanion 
              element="forest" 
              mood="happy" 
              size="md"
              onClick={() => {
                // Companion interaction
              }}
            />
          </div>

          {/* Placement hint */}
          {placementMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 rounded-lg px-4 py-2 text-sm font-medium">
              <Plus className="inline mr-1" size={16} />
              Click to place {sanctuaryItems.find(i => i.id === placementMode)?.name}
            </div>
          )}

          {/* Growth milestone indicator */}
          <div className="absolute top-4 right-4 bg-background/90 rounded-lg px-3 py-1">
            <div className="flex items-center gap-1 text-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="font-medium">Stage {sanctuaryGrowthStage + 1}</span>
            </div>
          </div>
        </div>
      </ElementalCard>

      {/* Available Items */}
      <ElementalCard className="p-6">
        <h3 className="text-lg font-bold mb-4">Sanctuary Shop</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sanctuaryItems.map((item) => {
            const cost = getItemCost(item);
            const canAfford = ecoPoints >= cost;
            
            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  item.unlocked && canAfford 
                    ? "border-primary hover:border-primary/70 cursor-pointer hover:shadow-lg" 
                    : "border-border opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (item.unlocked && canAfford && item.type !== "trophy") {
                    setPlacementMode(item.id);
                  }
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">{item.emoji}</div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="space-y-1">
                    {!item.unlocked && (
                      <Badge variant="outline" className="text-xs">
                        {item.type === "plant" && `Level ${playerLevel >= 2 ? 2 : playerLevel >= 3 ? 3 : 5} Required`}
                        {item.type === "decoration" && `${item.id === "crystal-fountain" ? 500 : 300} Eco-Points Required`}
                        {item.type === "trophy" && "Complete more achievements"}
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