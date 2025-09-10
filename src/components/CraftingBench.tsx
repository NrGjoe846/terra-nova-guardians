import { useState } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wrench, 
  Package, 
  CheckCircle, 
  XCircle,
  Zap,
  Cpu,
  Sparkles,
  Home,
  Info
} from "lucide-react";
import { CraftingRecipe, InventoryItem, Resource } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

interface CraftingBenchProps {
  playerLevel: number;
  inventory: InventoryItem[];
  onCraft: (recipeId: string) => void;
}

const RESOURCES: Resource[] = [
  {
    id: "bio-material",
    name: "Bio-Material",
    description: "Organic compounds essential for bio-synthesis",
    emoji: "🧬",
    rarity: "common",
    category: "bio-material"
  },
  {
    id: "energy-core",
    name: "Energy Core",
    description: "Concentrated bio-energy for powering systems",
    emoji: "⚡",
    rarity: "uncommon",
    category: "energy-core"
  },
  {
    id: "data-fragment",
    name: "Data Fragment",
    description: "Processed environmental data packets",
    emoji: "💾",
    rarity: "common",
    category: "data-fragment"
  },
  {
    id: "synthetic-component",
    name: "Synthetic Component",
    description: "Advanced synthetic materials for crafting",
    emoji: "⚙️",
    rarity: "rare",
    category: "synthetic-component"
  }
];

const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: "bio-enhancer",
    name: "Bio-Enhancer",
    description: "Boosts bio-synthesis efficiency by 25% for 10 minutes",
    resultItem: "bio-enhancer",
    resultQuantity: 1,
    requirements: [
      { resourceId: "bio-material", quantity: 3 },
      { resourceId: "energy-core", quantity: 1 }
    ],
    category: "consumable",
    unlockLevel: 3
  },
  {
    id: "data-amplifier",
    name: "Data Amplifier",
    description: "Increases data processing rewards by 50% for 15 minutes",
    resultItem: "data-amplifier",
    resultQuantity: 1,
    requirements: [
      { resourceId: "data-fragment", quantity: 5 },
      { resourceId: "synthetic-component", quantity: 1 }
    ],
    category: "consumable",
    unlockLevel: 4
  },
  {
    id: "drone-upgrade-speed",
    name: "Speed Upgrade Module",
    description: "Permanently increases Eco-Drone movement speed by 30%",
    resultItem: "drone-upgrade-speed",
    resultQuantity: 1,
    requirements: [
      { resourceId: "synthetic-component", quantity: 2 },
      { resourceId: "energy-core", quantity: 2 },
      { resourceId: "data-fragment", quantity: 3 }
    ],
    category: "drone-upgrade",
    unlockLevel: 5
  },
  {
    id: "drone-upgrade-efficiency",
    name: "Efficiency Upgrade Module",
    description: "Increases Eco-Drone task completion efficiency by 40%",
    resultItem: "drone-upgrade-efficiency",
    resultQuantity: 1,
    requirements: [
      { resourceId: "bio-material", quantity: 4 },
      { resourceId: "synthetic-component", quantity: 1 },
      { resourceId: "energy-core", quantity: 1 }
    ],
    category: "drone-upgrade",
    unlockLevel: 4
  },
  {
    id: "sanctuary-fountain",
    name: "Bio-Fountain",
    description: "A beautiful fountain that generates passive bio-energy",
    resultItem: "sanctuary-fountain",
    resultQuantity: 1,
    requirements: [
      { resourceId: "bio-material", quantity: 5 },
      { resourceId: "synthetic-component", quantity: 2 },
      { resourceId: "data-fragment", quantity: 2 }
    ],
    category: "sanctuary-decoration",
    unlockLevel: 6
  },
  {
    id: "sanctuary-garden",
    name: "Quantum Garden",
    description: "Advanced garden that attracts rare digital wildlife",
    resultItem: "sanctuary-garden",
    resultQuantity: 1,
    requirements: [
      { resourceId: "bio-material", quantity: 8 },
      { resourceId: "energy-core", quantity: 3 },
      { resourceId: "synthetic-component", quantity: 1 }
    ],
    category: "sanctuary-decoration",
    unlockLevel: 7
  },
  {
    id: "system-scanner",
    name: "System Scanner",
    description: "Tool that reveals hidden resources in mini-games",
    resultItem: "system-scanner",
    resultQuantity: 1,
    requirements: [
      { resourceId: "data-fragment", quantity: 10 },
      { resourceId: "synthetic-component", quantity: 3 }
    ],
    category: "tool",
    unlockLevel: 5
  }
];

export const CraftingBench = ({ playerLevel, inventory, onCraft }: CraftingBenchProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const { toast } = useToast();

  const getResource = (resourceId: string) => 
    RESOURCES.find(r => r.id === resourceId);

  const getInventoryQuantity = (resourceId: string) => 
    inventory.find(item => item.resourceId === resourceId)?.quantity || 0;

  const canCraftRecipe = (recipe: CraftingRecipe) => {
    if (playerLevel < recipe.unlockLevel) return false;
    
    return recipe.requirements.every(req => 
      getInventoryQuantity(req.resourceId) >= req.quantity
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "drone-upgrade": return <Cpu className="text-primary" size={20} />;
      case "sanctuary-decoration": return <Home className="text-accent" size={20} />;
      case "consumable": return <Zap className="text-secondary" size={20} />;
      case "tool": return <Wrench className="text-river" size={20} />;
      default: return <Package className="text-muted-foreground" size={20} />;
    }
  };

  const handleCraft = (recipe: CraftingRecipe) => {
    if (!canCraftRecipe(recipe)) {
      toast({
        title: "Cannot Craft Item",
        description: "Insufficient resources or level requirement not met",
        variant: "destructive"
      });
      return;
    }

    onCraft(recipe.id);
    setSelectedRecipe(null);
    
    toast({
      title: "Item Crafted Successfully! 🔧",
      description: `You crafted ${recipe.name}!`
    });
  };

  const availableRecipes = CRAFTING_RECIPES.filter(recipe => 
    playerLevel >= recipe.unlockLevel
  );

  const lockedRecipes = CRAFTING_RECIPES.filter(recipe => 
    playerLevel < recipe.unlockLevel
  );

  const renderRecipe = (recipe: CraftingRecipe, isLocked = false) => {
    const canCraft = !isLocked && canCraftRecipe(recipe);
    const isSelected = selectedRecipe === recipe.id;

    return (
      <BioSynthCard 
        key={recipe.id}
        className={`p-4 cursor-pointer transition-all duration-200 hud-panel ${
          isSelected ? 'border-primary neon-glow' : ''
        } ${isLocked ? 'opacity-50' : ''}`}
        onClick={() => !isLocked && setSelectedRecipe(isSelected ? null : recipe.id)}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(recipe.category)}
              <div>
                <h4 className="font-bold text-lg holo-text">{recipe.name}</h4>
                <p className="text-sm text-muted-foreground">{recipe.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="text-xs capitalize">
                {recipe.category.replace('-', ' ')}
              </Badge>
              {isLocked && (
                <Badge variant="outline" className="text-xs">
                  Level {recipe.unlockLevel}
                </Badge>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h5 className="font-semibold text-sm holo-text">Requirements:</h5>
            <div className="grid grid-cols-2 gap-2">
              {recipe.requirements.map(req => {
                const resource = getResource(req.resourceId);
                const hasEnough = getInventoryQuantity(req.resourceId) >= req.quantity;
                
                return (
                  <div 
                    key={req.resourceId}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      hasEnough ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    {hasEnough ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <XCircle className="text-red-500" size={16} />
                    )}
                    <span className="text-2xl">{resource?.emoji}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium">{resource?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {getInventoryQuantity(req.resourceId)}/{req.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result */}
          <div className="space-y-2">
            <h5 className="font-semibold text-sm holo-text">Result:</h5>
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/30">
              <Sparkles className="text-primary" size={16} />
              <span className="text-2xl">🎁</span>
              <div>
                <div className="text-sm font-medium">{recipe.name}</div>
                <div className="text-xs text-muted-foreground">
                  Quantity: {recipe.resultQuantity}
                </div>
              </div>
            </div>
          </div>

          {/* Craft Button */}
          {isSelected && !isLocked && (
            <BioSynthButton
              variant="geo-kinetic"
              onClick={(e) => {
                e.stopPropagation();
                handleCraft(recipe);
              }}
              disabled={!canCraft}
              className="w-full"
            >
              {canCraft ? "Craft Item" : "Insufficient Resources"}
            </BioSynthButton>
          )}
        </div>
      </BioSynthCard>
    );
  };

  return (
    <div className="space-y-6">
      <BioSynthCard className="p-6 text-center hud-panel">
        <div className="space-y-2">
          <Wrench className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">Crafting Bench</h2>
          <p className="text-muted-foreground">
            Combine resources to create powerful items and upgrades
          </p>
        </div>
      </BioSynthCard>

      <div className="space-y-6">
        {/* Available Recipes */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold holo-text">Available Recipes</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {availableRecipes.length > 0 ? (
                availableRecipes.map(recipe => renderRecipe(recipe))
              ) : (
                <BioSynthCard className="p-8 text-center">
                  <Info className="mx-auto text-muted-foreground mb-2" size={32} />
                  <p className="text-muted-foreground">
                    No recipes available at your current level. Keep leveling up to unlock more!
                  </p>
                </BioSynthCard>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Locked Recipes */}
        {lockedRecipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold holo-text">Locked Recipes</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {lockedRecipes.map(recipe => renderRecipe(recipe, true))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
