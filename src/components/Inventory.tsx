import { useState } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Package, 
  Zap, 
  Database, 
  Cpu, 
  Wrench,
  Sparkles,
  Info
} from "lucide-react";
import { Resource, InventoryItem, CraftedItem } from "@/types/game";

interface InventoryProps {
  inventory: InventoryItem[];
  craftedItems: { itemId: string; quantity: number }[];
  onResourceUse?: (resourceId: string, quantity: number) => void;
  onItemUse?: (itemId: string) => void;
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
  },
  {
    id: "quantum-crystal",
    name: "Quantum Crystal",
    description: "Rare crystalline structures with quantum properties",
    emoji: "💎",
    rarity: "legendary",
    category: "energy-core"
  }
];

const CRAFTED_ITEMS: CraftedItem[] = [
  {
    id: "guardian-badge",
    name: "Guardian Badge",
    description: "Symbol of your commitment to Terra Nova",
    emoji: "🏅",
    type: "tool"
  },
  {
    id: "system-key",
    name: "System Access Key",
    description: "Grants access to restricted system areas",
    emoji: "🗝️",
    type: "tool"
  },
  {
    id: "bio-enhancer",
    name: "Bio-Enhancer",
    description: "Temporarily boosts bio-synthesis efficiency",
    emoji: "🧪",
    type: "consumable",
    effects: { "bio-synthesis-boost": 25 }
  },
  {
    id: "data-amplifier",
    name: "Data Amplifier",
    description: "Increases data processing rewards",
    emoji: "📡",
    type: "consumable",
    effects: { "data-processing-boost": 50 }
  },
  {
    id: "drone-upgrade-speed",
    name: "Speed Upgrade Module",
    description: "Increases Eco-Drone movement speed",
    emoji: "🚀",
    type: "drone-upgrade",
    effects: { "drone-speed": 30 }
  },
  {
    id: "sanctuary-fountain",
    name: "Bio-Fountain",
    description: "Beautiful fountain for your Neural Sanctuary",
    emoji: "⛲",
    type: "sanctuary-decoration"
  }
];

export const Inventory = ({ 
  inventory, 
  craftedItems, 
  onResourceUse, 
  onItemUse 
}: InventoryProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("resources");

  const getResource = (resourceId: string) => 
    RESOURCES.find(r => r.id === resourceId);

  const getCraftedItem = (itemId: string) => 
    CRAFTED_ITEMS.find(i => i.id === itemId);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "uncommon": return "text-green-400";
      case "rare": return "text-blue-400";
      case "legendary": return "text-purple-400";
      default: return "text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bio-material": return <Zap className="text-green-400" size={16} />;
      case "energy-core": return <Cpu className="text-yellow-400" size={16} />;
      case "data-fragment": return <Database className="text-blue-400" size={16} />;
      case "synthetic-component": return <Wrench className="text-purple-400" size={16} />;
      default: return <Package className="text-muted-foreground" size={16} />;
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case "drone-upgrade": return <Cpu className="text-primary" size={16} />;
      case "sanctuary-decoration": return <Sparkles className="text-accent" size={16} />;
      case "consumable": return <Zap className="text-secondary" size={16} />;
      case "tool": return <Wrench className="text-river" size={16} />;
      default: return <Package className="text-muted-foreground" size={16} />;
    }
  };

  const renderResourceItem = (inventoryItem: InventoryItem) => {
    const resource = getResource(inventoryItem.resourceId);
    if (!resource) return null;

    return (
      <BioSynthCard 
        key={inventoryItem.resourceId}
        className={`p-4 cursor-pointer transition-all duration-200 hud-panel ${
          selectedItem === inventoryItem.resourceId ? 'border-primary neon-glow' : ''
        }`}
        onClick={() => setSelectedItem(
          selectedItem === inventoryItem.resourceId ? null : inventoryItem.resourceId
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(resource.category)}
              <span className="text-3xl">{resource.emoji}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {inventoryItem.quantity}
            </Badge>
          </div>
          
          <div>
            <h4 className={`font-bold ${getRarityColor(resource.rarity)}`}>
              {resource.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {resource.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs capitalize">
              {resource.rarity}
            </Badge>
            {selectedItem === inventoryItem.resourceId && onResourceUse && (
              <BioSynthButton
                variant="bio-energy"
                onClick={(e) => {
                  e.stopPropagation();
                  onResourceUse(inventoryItem.resourceId, 1);
                }}
                className="text-xs px-2 py-1"
              >
                Use
              </BioSynthButton>
            )}
          </div>
        </div>
      </BioSynthCard>
    );
  };

  const renderCraftedItem = (craftedItem: { itemId: string; quantity: number }) => {
    const item = getCraftedItem(craftedItem.itemId);
    if (!item) return null;

    return (
      <BioSynthCard 
        key={craftedItem.itemId}
        className={`p-4 cursor-pointer transition-all duration-200 hud-panel ${
          selectedItem === craftedItem.itemId ? 'border-primary neon-glow' : ''
        }`}
        onClick={() => setSelectedItem(
          selectedItem === craftedItem.itemId ? null : craftedItem.itemId
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getItemTypeIcon(item.type)}
              <span className="text-3xl">{item.emoji}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {craftedItem.quantity}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-bold text-primary holo-text">
              {item.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>

          {item.effects && (
            <div className="space-y-1">
              <p className="text-xs font-semibold holo-text">Effects:</p>
              {Object.entries(item.effects).map(([effect, value]) => (
                <div key={effect} className="text-xs text-accent">
                  +{value}% {effect.replace('-', ' ')}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs capitalize">
              {item.type.replace('-', ' ')}
            </Badge>
            {selectedItem === craftedItem.itemId && onItemUse && (
              <BioSynthButton
                variant="aether"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemUse(craftedItem.itemId);
                }}
                className="text-xs px-2 py-1"
              >
                {item.type === "consumable" ? "Use" : "Equip"}
              </BioSynthButton>
            )}
          </div>
        </div>
      </BioSynthCard>
    );
  };

  return (
    <div className="space-y-6">
      <BioSynthCard className="p-6 text-center hud-panel">
        <div className="space-y-2">
          <Package className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your collected resources and crafted items
          </p>
        </div>
      </BioSynthCard>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources">
            Resources ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="items">
            Items ({craftedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.length > 0 ? (
                inventory.map(renderResourceItem)
              ) : (
                <div className="col-span-full">
                  <BioSynthCard className="p-8 text-center">
                    <Info className="mx-auto text-muted-foreground mb-2" size={32} />
                    <p className="text-muted-foreground">
                      No resources collected yet. Complete mini-games and quests to gather materials!
                    </p>
                  </BioSynthCard>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {craftedItems.length > 0 ? (
                craftedItems.map(renderCraftedItem)
              ) : (
                <div className="col-span-full">
                  <BioSynthCard className="p-8 text-center">
                    <Info className="mx-auto text-muted-foreground mb-2" size={32} />
                    <p className="text-muted-foreground">
                      No crafted items yet. Visit the Crafting Bench to create useful items!
                    </p>
                  </BioSynthCard>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
