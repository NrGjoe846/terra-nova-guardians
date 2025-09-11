import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Star, Zap, Leaf, Droplets, Mountain, Cloud } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  type: "consumable" | "equipment" | "collectible" | "resource";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  quantity: number;
  description: string;
  icon: string;
  effects?: {
    ecoPointsBoost?: number;
    xpBoost?: number;
    duration?: number;
    special?: string;
  };
}

interface InventorySystemProps {
  onItemUse: (item: InventoryItem) => void;
}

export const InventorySystem = ({ onItemUse }: InventorySystemProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "energy-boost",
      name: "Elemental Energy Boost",
      type: "consumable",
      rarity: "uncommon",
      quantity: 3,
      description: "Increases XP gain by 50% for 30 minutes",
      icon: "⚡",
      effects: {
        xpBoost: 1.5,
        duration: 30
      }
    },
    {
      id: "eco-multiplier",
      name: "Eco-Point Multiplier",
      type: "consumable", 
      rarity: "rare",
      quantity: 2,
      description: "Doubles eco-point rewards for 1 hour",
      icon: "🍃",
      effects: {
        ecoPointsBoost: 2.0,
        duration: 60
      }
    },
    {
      id: "forest-crown",
      name: "Crown of the Forest",
      type: "equipment",
      rarity: "epic",
      quantity: 1,
      description: "Legendary headpiece that enhances nature connection",
      icon: "👑",
      effects: {
        ecoPointsBoost: 1.2,
        special: "Permanent forest element bonus"
      }
    },
    {
      id: "crystal-shard",
      name: "Terra Nova Crystal Shard",
      type: "collectible",
      rarity: "legendary",
      quantity: 1,
      description: "A rare crystal fragment from the heart of Terra Nova",
      icon: "💎",
      effects: {
        special: "Can be used to unlock special areas"
      }
    },
    {
      id: "ancient-seed",
      name: "Ancient Tree Seed",
      type: "resource",
      rarity: "rare",
      quantity: 5,
      description: "Seeds from the oldest trees in Terra Nova",
      icon: "🌰"
    },
    {
      id: "pure-water",
      name: "Pure Spring Water",
      type: "resource",
      rarity: "common",
      quantity: 12,
      description: "Crystal clear water from mountain springs",
      icon: "💧"
    },
    {
      id: "wind-essence",
      name: "Essence of Wind",
      type: "resource",
      rarity: "uncommon",
      quantity: 7,
      description: "Captured essence of the sky element",
      icon: "🌪️"
    },
    {
      id: "earth-stone",
      name: "Blessed Earth Stone",
      type: "resource",
      rarity: "uncommon",
      quantity: 4,
      description: "Stone infused with earth elemental power",
      icon: "🪨"
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-400 bg-gray-50";
      case "uncommon": return "border-green-400 bg-green-50";
      case "rare": return "border-blue-400 bg-blue-50";
      case "epic": return "border-purple-400 bg-purple-50";
      case "legendary": return "border-yellow-400 bg-yellow-50 animate-pulse";
      default: return "border-gray-400 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consumable": return <Zap className="text-orange-500" size={16} />;
      case "equipment": return <Star className="text-purple-500" size={16} />;
      case "collectible": return <Package className="text-blue-500" size={16} />;
      case "resource": return <Leaf className="text-green-500" size={16} />;
      default: return <Package className="text-gray-500" size={16} />;
    }
  };

  const categories = [
    { id: "all", name: "All Items", icon: <Package size={16} /> },
    { id: "consumable", name: "Consumables", icon: <Zap size={16} /> },
    { id: "equipment", name: "Equipment", icon: <Star size={16} /> },
    { id: "collectible", name: "Collectibles", icon: <Package size={16} /> },
    { id: "resource", name: "Resources", icon: <Leaf size={16} /> }
  ];

  const filteredItems = selectedCategory === "all" 
    ? inventory 
    : inventory.filter(item => item.type === selectedCategory);

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === "consumable" && item.quantity > 0) {
      setInventory(prev => prev.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0));
      onItemUse(item);
    }
  };

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueItems = inventory.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ElementalCard className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Package className="text-primary" size={32} />
            <h2 className="text-3xl font-bold bg-gradient-terra bg-clip-text text-transparent">
              Inventory
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{uniqueItems}</div>
              <div className="text-sm text-muted-foreground">Unique Items</div>
            </div>
          </div>
        </div>
      </ElementalCard>

      {/* Category Filter */}
      <ElementalCard className="p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <ElementalButton
              key={category.id}
              element={selectedCategory === category.id ? "forest" : "sky"}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-sm flex items-center gap-2 ${
                selectedCategory === category.id ? "" : "opacity-70"
              }`}
            >
              {category.icon}
              {category.name}
            </ElementalButton>
          ))}
        </div>
      </ElementalCard>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <ElementalCard 
            key={item.id} 
            className={`p-4 ${getRarityColor(item.rarity)}`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold">×{item.quantity}</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

              {/* Effects */}
              {item.effects && (
                <div className="space-y-1">
                  {item.effects.ecoPointsBoost && (
                    <div className="text-xs text-primary">
                      🍃 Eco-Points: +{Math.round((item.effects.ecoPointsBoost - 1) * 100)}%
                      {item.effects.duration && ` (${item.effects.duration}min)`}
                    </div>
                  )}
                  {item.effects.xpBoost && (
                    <div className="text-xs text-accent">
                      ⭐ XP Boost: +{Math.round((item.effects.xpBoost - 1) * 100)}%
                      {item.effects.duration && ` (${item.effects.duration}min)`}
                    </div>
                  )}
                  {item.effects.special && (
                    <div className="text-xs text-purple-600">
                      ✨ {item.effects.special}
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                {item.type === "consumable" && item.quantity > 0 && (
                  <ElementalButton
                    element="forest"
                    onClick={() => handleUseItem(item)}
                    className="w-full text-sm py-2"
                  >
                    Use Item
                  </ElementalButton>
                )}
                {item.type === "equipment" && (
                  <ElementalButton
                    element="sky"
                    className="w-full text-sm py-2"
                    disabled
                  >
                    Equipped
                  </ElementalButton>
                )}
                {(item.type === "collectible" || item.type === "resource") && (
                  <div className="text-center text-sm text-muted-foreground">
                    {item.type === "collectible" ? "Display Item" : "Crafting Material"}
                  </div>
                )}
              </div>
            </div>
          </ElementalCard>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <ElementalCard className="p-8 text-center">
          <Package className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
          <p className="text-muted-foreground">
            {selectedCategory === "all" 
              ? "Your inventory is empty. Complete activities to earn items!"
              : `No ${selectedCategory} items in your inventory.`
            }
          </p>
        </ElementalCard>
      )}
    </div>
  );
};
