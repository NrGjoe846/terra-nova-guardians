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
import { NeuralSanctuary } from "@/components/NeuralSanctuary";
import { Cpu, Globe, Zap, Users, Database, Gamepad2, Home, CircuitBoard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "map" | "decontaminate" | "duel" | "bioforge" | "sanctuary" | "evolution">("home");
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
    achievements: ["system-online", "decontamination-expert", "data-stream-champion", "daily-operative", "corruption-purger"]
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
    setPlayerData(prev => ({
      ...prev,
      bioCredits: prev.bioCredits + points,
      xp: prev.xp + points
    }));
    setCurrentView("home");
    
    toast({
      title: "System Operation Complete! ⚡",
      description: `You earned ${points} Bio-Credits!`,
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
      default:
        return <HomeView />;
    }
  };

  const HomeView = () => (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-5xl font-bold bio-synth-title mb-4">
            Terra Nova
          </h1>
          <p className="text-2xl text-primary font-semibold holo-text">Bio-Synth Guardians</p>
          <CircuitBoard className="absolute -top-2 -right-4 text-primary animate-energy-pulse" size={24} />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to Terra Nova, a bio-synthetic world where four critical System Cores have gone offline. 
            As a newly activated Bio-Synth Guardian, you must restore system integrity through decontamination protocols, 
            data stream operations, and environmental system management!
          </p>
        </div>

        <BioSynthCard floating className="max-w-md mx-auto p-6 hud-panel">
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center circuit-overlay">
                <div className="text-8xl animate-holo-float">🤖</div>
              </div>
              <div className="absolute top-2 right-2">
                <EcoDrone 
                  type={playerData.element} 
                  mood="curious" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Eco-Drone Status: Online 🤖",
                      description: "Your AI companion is ready for system operations!",
                    });
                  }}
                />
              </div>
              {playerData.bioModulePoints > 0 && (
                <div className="absolute top-2 left-2">
                  <button
                    onClick={() => setShowEvolution(true)}
                    className="bg-primary text-primary-foreground rounded-full p-2 animate-energy-pulse hover:scale-110 transition-transform neon-glow"
                  >
                    <Cpu size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{playerData.name}</h3>
              <Badge variant="secondary" className="capitalize">
                {playerData.element} Specialist
              </Badge>
              <LevelProgress 
                currentLevel={playerData.level}
                currentXP={playerData.xp}
                xpForNextLevel={playerData.xpForNext}
                element={playerData.element}
              />
            </div>
          </div>
        </BioSynthCard>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <BioSynthCard className="p-6 text-center hud-panel">
          <Globe className="mx-auto text-primary mb-2 animate-circuit-pulse" size={32} />
          <h3 className="font-bold text-lg holo-text">System Impact</h3>
          <EcoPoints points={playerData.bioCredits} size="lg" />
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center hud-panel">
          <Zap className="mx-auto text-accent mb-2 animate-circuit-pulse" size={32} />
          <h3 className="font-bold text-lg holo-text">Sectors Online</h3>
          <p className="text-2xl font-bold text-accent">
            {playerData.regionsUnlocked} / {regions.length}
          </p>
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center hud-panel">
          <Users className="mx-auto text-river mb-2 animate-circuit-pulse" size={32} />
          <h3 className="font-bold text-lg holo-text">Guardian Rank</h3>
          <p className="text-2xl font-bold text-river">
            Level {playerData.level}
          </p>
        </BioSynthCard>

        <BioSynthCard className="p-6 text-center hud-panel">
          <CircuitBoard className="mx-auto text-orange-500 mb-2 animate-circuit-pulse" size={32} />
          <h3 className="font-bold text-lg holo-text">System Uptime</h3>
          <p className="text-2xl font-bold text-orange-500">
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







