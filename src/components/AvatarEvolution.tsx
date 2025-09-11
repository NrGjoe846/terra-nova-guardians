import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarCompanion } from "@/components/AvatarCompanion";
import { Sparkles, Zap, Leaf, Droplets, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvolutionOption {
  id: string;
  name: string;
  description: string;
  element: "forest" | "sky" | "earth" | "river";
  unlocked: boolean;
  cost: number;
}

interface AvatarEvolutionProps {
  currentLevel: number;
  availablePoints: number;
  onEvolutionSelect: (optionId: string) => void;
  onClose: () => void;
}

export const AvatarEvolution = ({ 
  currentLevel, 
  availablePoints, 
  onEvolutionSelect,
  onClose 
}: AvatarEvolutionProps) => {
  const [selectedEvolution, setSelectedEvolution] = useState<string | null>(null);

  const evolutionOptions: EvolutionOption[] = [
    {
      id: "forest-cloak",
      name: "Living Cloak",
      description: "A cloak woven from living vines that sparkles with morning dew",
      element: "forest",
      unlocked: currentLevel >= 3,
      cost: 2
    },
    {
      id: "sky-wings",
      name: "Cloud Wings",
      description: "Ethereal wings made of crystallized air currents",
      element: "sky", 
      unlocked: currentLevel >= 5,
      cost: 3
    },
    {
      id: "earth-armor",
      name: "Stone Armor",
      description: "Protective armor crafted from the earth's strongest minerals",
      element: "earth",
      unlocked: currentLevel >= 4,
      cost: 2
    },
    {
      id: "river-crown",
      name: "Tidal Crown",
      description: "A crown of flowing water that never stops moving",
      element: "river",
      unlocked: currentLevel >= 6,
      cost: 4
    }
  ];

  const handleConfirmEvolution = () => {
    if (selectedEvolution) {
      onEvolutionSelect(selectedEvolution);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ElementalCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="text-primary animate-sparkle" size={32} />
              <h2 className="text-3xl font-bold bg-gradient-terra bg-clip-text text-transparent">
                Avatar Evolution
              </h2>
              <Sparkles className="text-primary animate-sparkle" size={32} />
            </div>
            <p className="text-muted-foreground">
              Choose how your Guardian will evolve and grow stronger!
            </p>
          </div>

          {/* Avatar Preview with Companion */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="text-8xl animate-float">🧙‍♂️</div>
              <div className="absolute -top-2 -right-2">
                <AvatarCompanion element="forest" mood="excited" size="sm" />
              </div>
              {/* Evolution energy effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-terra opacity-20 animate-pulse scale-110" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Level {currentLevel} Forest Guardian</h3>
              <Badge variant="secondary">
                {availablePoints} Evolution Points Available
              </Badge>
            </div>
          </div>

          {/* Evolution Options */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Available Evolutions:</h4>
            <div className="grid gap-4">
              {evolutionOptions.map((option) => {
                const Icon = {
                  forest: Leaf,
                  sky: Zap,
                  earth: Mountain,
                  river: Droplets
                }[option.element];

                const isSelected = selectedEvolution === option.id;
                const canAfford = availablePoints >= option.cost;

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-lg transform scale-105" 
                        : "border-border hover:border-primary/50",
                      !option.unlocked && "opacity-50 cursor-not-allowed",
                      !canAfford && option.unlocked && "opacity-75"
                    )}
                    onClick={() => {
                      if (option.unlocked && canAfford) {
                        setSelectedEvolution(option.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        `bg-gradient-${option.element}`
                      )}>
                        <Icon size={24} className="text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-lg">{option.name}</h5>
                          <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-primary" />
                            <span className="font-semibold">{option.cost}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          {option.description}
                        </p>
                        
                        <div className="flex gap-2">
                          {!option.unlocked && (
                            <Badge variant="outline">
                              Unlocks at Level {option.id === "forest-cloak" ? 3 : option.id === "earth-armor" ? 4 : option.id === "sky-wings" ? 5 : 6}
                            </Badge>
                          )}
                          {option.unlocked && !canAfford && (
                            <Badge variant="destructive">
                              Need {option.cost - availablePoints} more points
                            </Badge>
                          )}
                          {option.unlocked && canAfford && (
                            <Badge variant="secondary">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="text-primary animate-pulse">
                          <Sparkles size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <ElementalButton 
              element="forest"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </ElementalButton>
            
            <ElementalButton
              element="sky"
              onClick={handleConfirmEvolution}
              disabled={!selectedEvolution}
              className="flex-1"
              glowing={!!selectedEvolution}
            >
              Evolve Guardian! ✨
            </ElementalButton>
          </div>
        </div>
      </ElementalCard>
    </div>
  );
};