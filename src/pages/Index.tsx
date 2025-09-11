import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EcoPoints } from "@/components/EcoPoints";
import { LevelProgress } from "@/components/LevelProgress";
import { TerraNovaMap } from "@/components/TerraNovaMap";
import { RecycleRushGame } from "@/components/RecycleRushGame";
import { EcoQuiz } from "@/components/EcoQuiz";
import { AvatarCompanion } from "@/components/AvatarCompanion";
import { AvatarEvolution } from "@/components/AvatarEvolution";
import { DailyStreak } from "@/components/DailyStreak";
import { PollutionPurgeGame } from "@/components/PollutionPurgeGame";
import { EcoSanctuary } from "@/components/EcoSanctuary";
import { Sparkles, Globe, TreePine, Users, BookOpen, Gamepad2, Home, Zap, Trophy, Package } from "lucide-react";
import guardianImage from "@/assets/elemental-guardians.jpg";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "map" | "game" | "quiz" | "pollution" | "sanctuary" | "evolution">("home");
  const [showEvolution, setShowEvolution] = useState(false);
  const [playerData, setPlayerData] = useState({
    name: "New Guardian",
    element: "forest" as const,
    level: 3,
    xp: 150,
    xpForNext: 300,
    ecoPoints: 750,
    regionsUnlocked: 1,
    dailyStreak: 5,
    evolutionPoints: 3,
    achievements: ["first-login", "recycle-master", "quiz-champion", "daily-warrior", "pollution-fighter"]
  });
  const { toast } = useToast();

  const regions = [
    {
      id: "forest",
      name: "Withered Forest",
      element: "forest" as const,
      unlocked: true,
      progress: 35,
      description: "Ancient trees cry out for restoration"
    },
    {
      id: "sky", 
      name: "Clouded Peaks",
      element: "sky" as const,
      unlocked: false,
      progress: 0,
      description: "The sky spirits await your call"
    },
    {
      id: "mountain",
      name: "Silent Mountains", 
      element: "earth" as const,
      unlocked: false,
      progress: 0,
      description: "Stone guardians slumber in darkness"
    },
    {
      id: "river",
      name: "Dried Rivers",
      element: "river" as const, 
      unlocked: false,
      progress: 0,
      description: "Once mighty waters reduced to whispers"
    }
  ];

  const handleActivityComplete = (points: number) => {
    setPlayerData(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + points,
      xp: prev.xp + points
    }));
    setCurrentView("home");
    
    toast({
      title: "Mission Complete! 🎉",
      description: `You earned ${points} Eco-Points!`,
    });
  };

  const handleEvolutionSelect = (evolutionId: string) => {
    setPlayerData(prev => ({
      ...prev,
      evolutionPoints: prev.evolutionPoints - 1
    }));
    setShowEvolution(false);
    
    toast({
      title: "Evolution Complete! ✨",
      description: "Your Guardian has evolved with new powers!",
    });
  };

  const handleRewardClaim = (reward: any) => {
    const points = reward.amount || 25;
    setPlayerData(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + points,
      xp: prev.xp + (points / 2)
    }));
    
    toast({
      title: "Daily Reward Claimed! 🎁",
      description: `You received ${reward.amount || 25} Eco-Points!`,
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
      case "game":
        return <RecycleRushGame onGameComplete={handleActivityComplete} />;
      case "quiz":
        return <EcoQuiz onQuizComplete={handleActivityComplete} />;
      case "pollution":
        return <PollutionPurgeGame onGameComplete={handleActivityComplete} />;
      case "sanctuary":
        return (
          <EcoSanctuary 
            playerLevel={playerData.level}
            ecoPoints={playerData.ecoPoints}
            achievements={playerData.achievements}
            onItemPurchase={(itemId, cost) => {
              setPlayerData(prev => ({
                ...prev,
                ecoPoints: prev.ecoPoints - cost
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
          <h1 className="text-5xl font-bold bg-gradient-terra bg-clip-text text-transparent mb-4">
            Eco-Guardians
          </h1>
          <p className="text-2xl text-primary font-semibold">The Elemental Quest</p>
          <Sparkles className="absolute -top-2 -right-4 text-primary animate-sparkle" size={24} />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to Terra Nova, a magical world where four ancient Elemental Cores have dimmed. 
            As a newly awakened Eco-Guardian, you must restore balance through eco-challenges, 
            mini-games, and environmental knowledge!
          </p>
        </div>

        <ElementalCard floating className="max-w-md mx-auto p-6">
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={guardianImage}
                alt="Elemental Guardians"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute top-2 right-2">
                <AvatarCompanion 
                  element={playerData.element} 
                  mood="curious" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Your Companion Says Hi! 👋",
                      description: "Your faithful companion is excited to explore Terra Nova with you!",
                    });
                  }}
                />
              </div>
              {playerData.evolutionPoints > 0 && (
                <div className="absolute top-2 left-2">
                  <button
                    onClick={() => setShowEvolution(true)}
                    className="bg-primary text-primary-foreground rounded-full p-2 animate-pulse hover:scale-110 transition-transform"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{playerData.name}</h3>
              <Badge variant="secondary" className="capitalize">
                {playerData.element} Guardian
              </Badge>
              <LevelProgress 
                currentLevel={playerData.level}
                currentXP={playerData.xp}
                xpForNextLevel={playerData.xpForNext}
                element={playerData.element}
              />
            </div>
          </div>
        </ElementalCard>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <ElementalCard className="p-6 text-center">
          <Globe className="mx-auto text-primary mb-2" size={32} />
          <h3 className="font-bold text-lg">Your Impact</h3>
          <EcoPoints points={playerData.ecoPoints} size="lg" />
        </ElementalCard>

        <ElementalCard className="p-6 text-center">
          <TreePine className="mx-auto text-accent mb-2" size={32} />
          <h3 className="font-bold text-lg">Regions Restored</h3>
          <p className="text-2xl font-bold text-accent">
            {playerData.regionsUnlocked} / {regions.length}
          </p>
        </ElementalCard>

        <ElementalCard className="p-6 text-center">
          <Users className="mx-auto text-river mb-2" size={32} />
          <h3 className="font-bold text-lg">Guardian Rank</h3>
          <p className="text-2xl font-bold text-river">
            Level {playerData.level}
          </p>
        </ElementalCard>

        <ElementalCard className="p-6 text-center">
          <Sparkles className="mx-auto text-orange-500 mb-2" size={32} />
          <h3 className="font-bold text-lg">Daily Streak</h3>
          <p className="text-2xl font-bold text-orange-500">
            {playerData.dailyStreak} Days
          </p>
        </ElementalCard>
      </div>

      <DailyStreak 
        currentStreak={playerData.dailyStreak}
        onRewardClaim={handleRewardClaim}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="text-primary" size={32} />
            <div>
              <h3 className="text-xl font-bold">Explore Terra Nova</h3>
              <p className="text-muted-foreground">
                Discover magical regions and restore the elemental balance
              </p>
            </div>
          </div>
          
          {/* Region Preview Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {regions.map((region) => (
              <div 
                key={region.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  region.unlocked 
                    ? "border-primary/30 bg-primary/5 hover:border-primary/50 cursor-pointer" 
                    : "border-border bg-muted/30 opacity-60"
                )}
                onClick={() => region.unlocked && setCurrentView("map")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    region.unlocked ? "bg-primary animate-pulse" : "bg-muted-foreground"
                  )} />
                  <span className="font-medium text-sm">{region.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{region.progress}%</span>
                  </div>
                  <Progress value={region.progress} className="h-1" />
                </div>
              </div>
            ))}
          </div>
          
          <ElementalButton 
            element="forest" 
            onClick={() => setCurrentView("map")}
            className="w-full"
          >
            <Globe className="mr-2" size={16} />
            Open Full World Map
          </ElementalButton>
        </ElementalCard>

        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Home className="text-accent" size={32} />
            <div>
              <h3 className="text-xl font-bold">Your Eco-Sanctuary</h3>
              <p className="text-muted-foreground">
                Customize your magical home base and tend to your gardens
              </p>
            </div>
          </div>
          <ElementalButton 
            element="sky" 
            onClick={() => setCurrentView("sanctuary")}
            className="w-full"
          >
            Visit Sanctuary
          </ElementalButton>
        </ElementalCard>

        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Gamepad2 className="text-river" size={32} />
            <div>
              <h3 className="text-xl font-bold">Play Mini-Games</h3>
              <p className="text-muted-foreground">
                Learn through fun activities and earn Eco-Points
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <ElementalButton 
              element="river" 
              onClick={() => setCurrentView("game")}
              className="w-full"
            >
              ♻️ Recycle Rush
            </ElementalButton>
            <ElementalButton 
              element="earth" 
              onClick={() => setCurrentView("pollution")}
              className="w-full"
            >
              <Zap className="mr-2" size={16} />
              Pollution Purge
            </ElementalButton>
          </div>
        </ElementalCard>

        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="text-secondary" size={32} />
            <div>
              <h3 className="text-xl font-bold">Test Your Knowledge</h3>
              <p className="text-muted-foreground">
                Answer eco-questions to gain wisdom and XP
              </p>
            </div>
          </div>
          <ElementalButton 
            element="forest" 
            onClick={() => setCurrentView("quiz")}
            className="w-full"
          >
            🧠 Eco Quiz Challenge
          </ElementalButton>
        </ElementalCard>
      </div>

      <ElementalCard className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center space-y-3">
          <Sparkles className="mx-auto text-primary" size={32} />
          <h3 className="text-xl font-bold">Real-World Challenges & AR Adventures</h3>
          <p className="text-muted-foreground text-sm">
            Complete real environmental actions, use AR to scan objects, and join multiplayer quests with friends!
          </p>
          <Badge variant="outline" className="animate-pulse">
            Coming Soon
          </Badge>
        </div>
      </ElementalCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {currentView !== "home" && (
        <div className="p-4">
          <ElementalButton 
            element="forest" 
            onClick={() => setCurrentView("home")}
          >
            ← Back to Home
          </ElementalButton>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {renderView()}
      </div>

      {currentView === "home" && (
        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            🌍 Together, we can restore Terra Nova and protect our real world! 🌱
          </p>
        </footer>
      )}

      {showEvolution && (
        <AvatarEvolution
          currentLevel={playerData.level}
          availablePoints={playerData.evolutionPoints}
          onEvolutionSelect={handleEvolutionSelect}
          onClose={() => setShowEvolution(false)}
        />
      )}
    </div>
  );
};

export default Index;
