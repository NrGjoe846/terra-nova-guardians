import { useState } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { EcoPoints } from "@/components/EcoPoints";
import { LevelProgress } from "@/components/LevelProgress";
import { TerraNovaMap } from "@/components/TerraNovaMap";
import { DecontaminateProtocol } from "@/components/DecontaminateProtocol";
import { DataStreamDuel } from "@/components/DataStreamDuel";
import { EcoDrone } from "@/components/EcoDrone";
import { AvatarEvolution as BioModuleEvolution } from "@/components/AvatarEvolution";
import { DailyStreak } from "@/components/DailyStreak";
import { BioForgeSynthesis } from "@/components/BioForgeSynthesis";
import { EcoSanctuary as NeuralSanctuary } from "@/components/NeuralSanctuary";
import { QuestLog } from "@/components/QuestLog";
import { Inventory } from "@/components/Inventory";
import { CraftingBench } from "@/components/CraftingBench";
import { GlobalImpactDisplay } from "@/components/GlobalImpactDisplay";
import { Leaderboard } from "@/components/Leaderboard";
import { Cpu, Globe, Zap, Users, Database, Gamepad2, Home, CircuitBoard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Quest, InventoryItem, GameProgress } from "@/types/game";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "map" | "decontaminate" | "duel" | "bioforge" | "sanctuary" | "evolution" | "quests" | "inventory" | "crafting" | "global" | "leaderboard">("home");
  const [showEvolution, setShowEvolution] = useState(false);
  const [playerData, setPlayerData] = useState({
    name: "Bio-Synth Guardian",
    element: "bio-energy" as const,
    level: 3,
    xp: 150,
    xpForNext: 300,
    bioCredits: 750,
    regionsUnlocked: 1,
    dailyStreak: 5,
    bioModulePoints: 3,
    achievements: ["system-online", "decontamination-expert", "data-stream-champion", "daily-operative", "corruption-purger"],
    inventory: [
      { resourceId: "bio-material", quantity: 5 },
      { resourceId: "energy-core", quantity: 2 },
      { resourceId: "data-fragment", quantity: 8 },
      { resourceId: "synthetic-component", quantity: 1 }
    ] as InventoryItem[],
    craftedItems: [
      { itemId: "guardian-badge", quantity: 1 }
    ],
    gameProgress: {
      gamesCompleted: {
        decontaminate: 12,
        datastream: 8,
        bioforge: 5
      },
      resourcesCollected: {
        "bio-material": 15,
        "energy-core": 3,
        "data-fragment": 22,
        "synthetic-component": 2
      },
      itemsCrafted: {
        "bio-enhancer": 2,
        "guardian-badge": 1
      }
    } as GameProgress
  });
  const { toast } = useToast();

  const regions = [
    {
      id: "bio-sector",
      name: "Bio-Energy Sector",
      element: "bio-energy" as const,
      unlocked: true,
      progress: 35,
      description: "Primary bio-energy core requires system restoration"
    },
    {
      id: "aether-zone", 
      name: "Aether Processing Zone",
      element: "aether" as const,
      unlocked: false,
      progress: 0,
      description: "Atmospheric processing systems offline"
    },
    {
      id: "geo-kinetic",
      name: "Geo-Kinetic Grid", 
      element: "geo-kinetic" as const,
      unlocked: false,
      progress: 0,
      description: "Geological energy matrix in standby mode"
    },
    {
      id: "hydro-core",
      name: "Hydro-Core Network",
      element: "hydro-core" as const, 
      unlocked: false,
      progress: 0,
      description: "Aquatic processing systems require activation"
    }
  ];

  const handleActivityComplete = (points: number) => {
    // Determine which game was completed and award resources
    const gameType = currentView === "decontaminate" ? "decontaminate" : 
                    currentView === "duel" ? "datastream" : 
                    currentView === "bioforge" ? "bioforge" : "unknown";
    
    // Award random resources based on game type
    const resourceRewards = {
      decontaminate: [
        { resourceId: "bio-material", quantity: Math.floor(Math.random() * 2) + 1 },
        { resourceId: "energy-core", quantity: Math.random() > 0.7 ? 1 : 0 }
      ],
      datastream: [
        { resourceId: "data-fragment", quantity: Math.floor(Math.random() * 3) + 1 },
        { resourceId: "synthetic-component", quantity: Math.random() > 0.8 ? 1 : 0 }
      ],
      bioforge: [
        { resourceId: "bio-material", quantity: Math.floor(Math.random() * 2) + 1 },
        { resourceId: "synthetic-component", quantity: Math.random() > 0.6 ? 1 : 0 }
      ]
    };

    setPlayerData(prev => ({
      ...prev,
      bioCredits: prev.bioCredits + points,
      xp: prev.xp + points,
      gameProgress: {
        ...prev.gameProgress,
        gamesCompleted: {
          ...prev.gameProgress.gamesCompleted,
          [gameType]: (prev.gameProgress.gamesCompleted[gameType] || 0) + 1
        }
      },
      inventory: prev.inventory.map(item => {
        const reward = resourceRewards[gameType as keyof typeof resourceRewards]?.find(r => r.resourceId === item.resourceId);
        return reward ? { ...item, quantity: item.quantity + reward.quantity } : item;
      }).concat(
        resourceRewards[gameType as keyof typeof resourceRewards]?.filter(reward => 
          !prev.inventory.some(item => item.resourceId === reward.resourceId)
        ).map(reward => ({ resourceId: reward.resourceId, quantity: reward.quantity })) || []
      )
    }));
    setCurrentView("home");
    
    toast({
      title: "System Operation Complete! ⚡",
      description: `You earned ${points} Bio-Credits and resources!`,
    });
  };

  const handleEvolutionSelect = (evolutionId: string) => {
    setPlayerData(prev => ({
      ...prev,
      bioModulePoints: prev.bioModulePoints - 1
    }));
    setShowEvolution(false);
    
    toast({
      title: "Bio-Module Integration Complete! 🔋",
      description: "Your Bio-Synth Guardian has been upgraded!",
    });
  };

  const handleRewardClaim = (reward: any) => {
    const points = reward.amount || 25;
    setPlayerData(prev => ({
      ...prev,
      bioCredits: prev.bioCredits + points,
      xp: prev.xp + (points / 2)
    }));
    
    toast({
      title: "Daily System Reward Claimed! 💾",
      description: `You received ${reward.amount || 25} Bio-Credits!`,
    });
  };

  const handleQuestComplete = (quest: Quest) => {
    let totalBioCredits = 0;
    let totalXP = 0;
    const newResources: InventoryItem[] = [];
    const newItems: { itemId: string; quantity: number }[] = [];

    quest.rewards.forEach(reward => {
      switch (reward.type) {
        case "bio-credits":
          totalBioCredits += reward.amount || 0;
          break;
        case "xp":
          totalXP += reward.amount || 0;
          break;
        case "resource":
          if (reward.resourceType) {
            newResources.push({ resourceId: reward.resourceType, quantity: reward.amount || 1 });
          }
          break;
        case "item":
          if (reward.itemId) {
            newItems.push({ itemId: reward.itemId, quantity: 1 });
          }
          break;
      }
    });

    setPlayerData(prev => ({
      ...prev,
      bioCredits: prev.bioCredits + totalBioCredits,
      xp: prev.xp + totalXP,
      inventory: prev.inventory.map(item => {
        const newResource = newResources.find(r => r.resourceId === item.resourceId);
        return newResource ? { ...item, quantity: item.quantity + newResource.quantity } : item;
      }).concat(
        newResources.filter(newResource => 
          !prev.inventory.some(item => item.resourceId === newResource.resourceId)
        )
      ),
      craftedItems: prev.craftedItems.map(item => {
        const newItem = newItems.find(i => i.itemId === item.itemId);
        return newItem ? { ...item, quantity: item.quantity + newItem.quantity } : item;
      }).concat(
        newItems.filter(newItem => 
          !prev.craftedItems.some(item => item.itemId === newItem.itemId)
        )
      )
    }));

    toast({
      title: "Quest Completed! 🎉",
      description: `${quest.title} - Rewards claimed!`,
    });
  };

  const handleQuestActivate = (questId: string) => {
    toast({
      title: "Quest Activated! 📋",
      description: "New objectives added to your quest log!",
    });
  };

  const handleCraft = (recipeId: string) => {
    // This would implement the actual crafting logic
    // For now, just show success message
    toast({
      title: "Item Crafted! 🔧",
      description: "Successfully created new item!",
    });
  };

  const handleResourceUse = (resourceId: string, quantity: number) => {
    setPlayerData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => 
        item.resourceId === resourceId 
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
          : item
      ).filter(item => item.quantity > 0)
    }));

    toast({
      title: "Resource Used",
      description: `Used ${quantity} ${resourceId.replace('-', ' ')}`,
    });
  };

  const handleItemUse = (itemId: string) => {
    setPlayerData(prev => ({
      ...prev,
      craftedItems: prev.craftedItems.map(item => 
        item.itemId === itemId 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    }));

    toast({
      title: "Item Used",
      description: `Used ${itemId.replace('-', ' ')}`,
    });
  };

  const renderView = () => {
    switch (currentView) {
      case "map":
        return (
          <TerraNovaMap 
            regions={regions}
            onRegionSelect={(regionId) => {
              console.log("Selected region:", regionId);
              setCurrentView("home");
            }}
          />
        );
      case "decontaminate":
        return <DecontaminateProtocol onGameComplete={handleActivityComplete} />;
      case "duel":
        return <DataStreamDuel onQuizComplete={handleActivityComplete} />;
      case "bioforge":
        return <BioForgeSynthesis onGameComplete={handleActivityComplete} />;
      case "sanctuary":
        return (
          <NeuralSanctuary 
            playerLevel={playerData.level}
            bioCredits={playerData.bioCredits}
            achievements={playerData.achievements}
            onItemPurchase={(itemId, cost) => {
              setPlayerData(prev => ({
                ...prev,
                bioCredits: prev.bioCredits - cost
              }));
            }}
          />
        );
      case "quests":
        return (
          <QuestLog
            playerLevel={playerData.level}
            bioCredits={playerData.bioCredits}
            gameProgress={playerData.gameProgress}
            onQuestComplete={handleQuestComplete}
            onQuestActivate={handleQuestActivate}
          />
        );
      case "inventory":
        return (
          <Inventory
            inventory={playerData.inventory}
            craftedItems={playerData.craftedItems}
            onResourceUse={handleResourceUse}
            onItemUse={handleItemUse}
          />
        );
      case "crafting":
        return (
          <CraftingBench
            playerLevel={playerData.level}
            inventory={playerData.inventory}
            onCraft={handleCraft}
          />
        );
      case "global":
        return (
          <GlobalImpactDisplay
            playerContribution={{
              bioCreditsEarned: playerData.bioCredits,
              pollutionCleansed: playerData.gameProgress.gamesCompleted.decontaminate * 10,
              dataProcessed: playerData.gameProgress.gamesCompleted.datastream * 15,
              synthesesCompleted: playerData.gameProgress.gamesCompleted.bioforge * 5
            }}
          />
        );
      case "leaderboard":
        return (
          <Leaderboard
            playerName={playerData.name}
            playerStats={{
              bioCredits: playerData.bioCredits,
              level: playerData.level,
              gamesCompleted: Object.values(playerData.gameProgress.gamesCompleted).reduce((a, b) => a + b, 0),
              questsCompleted: 5 // This would be tracked in real implementation
            }}
          />
        );
      default:
        return <HomeView />;
    }
  };

  const HomeView = () => (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-6xl font-bold terra-tots-title mb-4">
            🌱 Terra-Tots 🌱
          </h1>
          <p className="text-3xl text-primary font-bold cheerful-text">Nature's Little Helpers!</p>
          <div className="absolute -top-2 -right-4 text-4xl animate-bounce">🌟</div>
          <div className="absolute -top-2 -left-4 text-3xl animate-wiggle">🦋</div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to Terra-Tots Land, a magical place where nature needs your help! 🌍✨ 
            Join our friendly animal guides and become a Nature Helper by playing fun games, 
            learning about the environment, and helping make our world a cleaner, happier place! 🌈
          </p>
        </div>

        <BioSynthCard floating className="max-w-md mx-auto p-6 friendly-panel">
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center nature-overlay">
                <div className="text-8xl animate-bounce-float">👶</div>
              </div>
              <div className="absolute top-2 right-2">
                <div className="text-3xl animate-dance">🐿️</div>
              </div>
              <div className="absolute bottom-2 left-2">
                <div className="text-2xl animate-wiggle">🌸</div>
              </div>
              <div className="absolute top-2 left-2">
                <div className="text-2xl animate-sparkle">✨</div>
              </div>
              {playerData.bioModulePoints > 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setShowEvolution(true)}
                    className="bg-primary text-primary-foreground rounded-full p-3 animate-bounce hover:scale-110 transition-transform happy-glow text-2xl"
                  >
                    🎁
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold cheerful-text">{playerData.name}</h3>
              <Badge variant="secondary" className="text-lg px-4 py-2 rounded-full bg-gradient-nature text-white font-bold">
                🌟 Level {playerData.level} Helper 🌟
              </Badge>
              <LevelProgress 
                currentLevel={playerData.level}
                currentXP={playerData.xp}
                xpForNextLevel={playerData.xpForNext}
                element="sunny"
              />
            </div>
          </div>
        </BioSynthCard>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <BioSynthCard className="p-6 text-center friendly-panel">
          <div className="text-4xl mb-2 animate-sparkle">🌍</div>
          <h3 className="font-bold text-lg cheerful-text">Helper Points</h3>
          <EcoPoints points={playerData.bioCredits} size="lg" />
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center friendly-panel">
          <div className="text-4xl mb-2 animate-wiggle">🏡</div>
          <h3 className="font-bold text-lg cheerful-text">Areas Helped</h3>
          <p className="text-3xl font-bold text-accent">
            {playerData.regionsUnlocked} / {regions.length}
          </p>
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center friendly-panel">
          <div className="text-4xl mb-2 animate-bounce">🏆</div>
          <h3 className="font-bold text-lg cheerful-text">Helper Level</h3>
          <p className="text-3xl font-bold text-river">
            Level {playerData.level}
          </p>
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center friendly-panel">
          <div className="text-4xl mb-2 animate-dance">📅</div>
          <h3 className="font-bold text-lg cheerful-text">Daily Streak</h3>
          <p className="text-3xl font-bold text-orange-500">
            {playerData.dailyStreak} Days
          </p>
        </BioSynthCard>
      </div>

      <DailyStreak 
        currentStreak={playerData.dailyStreak}
        onRewardClaim={handleRewardClaim}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="text-primary animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Access System Grid</h3>
              <p className="text-muted-foreground">
                Navigate the bio-synthetic sectors and initiate restoration protocols
              </p>
            </div>
          </div>
          <BioSynthButton 
            variant="bio-energy" 
            onClick={() => setCurrentView("map")}
            className="w-full"
          >
            Access System Grid
          </BioSynthButton>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Database className="text-accent animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Quest Log</h3>
              <p className="text-muted-foreground">
                Track your missions and earn rewards for completing objectives
              </p>
            </div>
          </div>
          <BioSynthButton 
            variant="aether" 
            onClick={() => setCurrentView("quests")}
            className="w-full"
          >
            View Quests
          </BioSynthButton>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Home className="text-accent animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Neural Sanctuary</h3>
              <p className="text-muted-foreground">
                Customize your digital command center and manage bio-nodes
              </p>
            </div>
          </div>
          <BioSynthButton 
            variant="aether" 
            onClick={() => setCurrentView("sanctuary")}
            className="w-full"
          >
            Enter Sanctuary
          </BioSynthButton>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <CircuitBoard className="text-secondary animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Inventory & Crafting</h3>
              <p className="text-muted-foreground">
                Manage resources and craft powerful items and upgrades
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <BioSynthButton 
              variant="geo-kinetic" 
              onClick={() => setCurrentView("inventory")}
              className="w-full"
            >
              📦 Inventory ({playerData.inventory.length})
            </BioSynthButton>
            <BioSynthButton 
              variant="hydro-core" 
              onClick={() => setCurrentView("crafting")}
              className="w-full"
            >
              🔧 Crafting Bench
            </BioSynthButton>
          </div>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Gamepad2 className="text-river animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">System Protocols</h3>
              <p className="text-muted-foreground">
                Execute system operations and earn Bio-Credits
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <BioSynthButton 
              variant="hydro-core" 
              onClick={() => setCurrentView("decontaminate")}
              className="w-full"
            >
              🧹 Decontaminate Protocol
            </BioSynthButton>
            <BioSynthButton 
              variant="geo-kinetic" 
              onClick={() => setCurrentView("bioforge")}
              className="w-full"
            >
              <CircuitBoard className="mr-2" size={16} />
              Bio-Forge Synthesis
            </BioSynthButton>
          </div>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Database className="text-secondary animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Data Stream Analysis</h3>
              <p className="text-muted-foreground">
                Process environmental data streams to gain system access
              </p>
            </div>
          </div>
          <BioSynthButton 
            variant="bio-energy" 
            onClick={() => setCurrentView("duel")}
            className="w-full"
          >
            💾 Data Stream Duel
          </BioSynthButton>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="flex items-center gap-4 mb-4">
            <Users className="text-river animate-circuit-pulse" size={32} />
            <div>
              <h3 className="text-xl font-bold holo-text">Community Hub</h3>
              <p className="text-muted-foreground">
                View global impact and compete with other Guardians
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <BioSynthButton 
              variant="aether" 
              onClick={() => setCurrentView("global")}
              className="w-full"
            >
              🌍 Global Impact
            </BioSynthButton>
            <BioSynthButton 
              variant="bio-energy" 
              onClick={() => setCurrentView("leaderboard")}
              className="w-full"
            >
              🏆 Leaderboards
            </BioSynthButton>
          </div>
        </BioSynthCard>
      </div>

      <BioSynthCard className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 hud-panel circuit-overlay">
        <div className="text-center space-y-3">
          <CircuitBoard className="mx-auto text-primary animate-energy-pulse" size={32} />
          <h3 className="text-xl font-bold holo-text">AR Field Operations & Bio-Scan Protocol</h3>
          <p className="text-muted-foreground text-sm">
            Execute real-world environmental missions, use AR bio-scanning, and join multiplayer system operations!
          </p>
          <Badge variant="outline" className="animate-pulse">
            System Update Pending
          </Badge>
        </div>
      </BioSynthCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-background circuit-overlay">
      {currentView !== "home" && (
        <div className="p-4">
          <BioSynthButton 
            variant="bio-energy" 
            onClick={() => setCurrentView("home")}
          >
            ← Return to Command Center
          </BioSynthButton>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {renderView()}
      </div>

      {currentView === "home" && (
        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            🌐 System Integrity: Restoring Terra Nova's bio-synthetic ecosystem 🔋
          </p>
        </footer>
      )}

      {showEvolution && (
        <BioModuleEvolution
          currentLevel={playerData.level}
          availablePoints={playerData.bioModulePoints}
          onEvolutionSelect={handleEvolutionSelect}
          onClose={() => setShowEvolution(false)}
        />
      )}
    </div>
  );
};

export default Index;
