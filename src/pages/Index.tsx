import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { EcoPoints } from "@/components/EcoPoints";
import { LevelProgress } from "@/components/LevelProgress";
import { TerraNovaMap } from "@/components/TerraNovaMap";
import { RecycleRushGame } from "@/components/RecycleRushGame";
import { EcoQuiz } from "@/components/EcoQuiz";
import { Sparkles, Globe, TreePine, Users, BookOpen, Gamepad2 } from "lucide-react";
import guardianImage from "@/assets/elemental-guardians.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "map" | "game" | "quiz">("home");
  const [playerData, setPlayerData] = useState({
    name: "New Guardian",
    element: "forest" as const,
    level: 1,
    xp: 150,
    xpForNext: 300,
    ecoPoints: 250,
    regionsUnlocked: 1
  });

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
      default:
        return <HomeView />;
    }
  };

  const HomeView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
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

        {/* Guardian Avatar */}
        <ElementalCard floating className="max-w-md mx-auto p-6">
          <div className="space-y-4">
            <img 
              src={guardianImage}
              alt="Elemental Guardians"
              className="w-full h-48 object-cover rounded-xl"
            />
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

      {/* Stats Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
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
      </div>

      {/* Action Menu */}
      <div className="grid md:grid-cols-2 gap-6">
        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="text-primary" size={32} />
            <div>
              <h3 className="text-xl font-bold">Explore Terra Nova</h3>
              <p className="text-muted-foreground">
                Visit the elemental regions and begin your restoration journey
              </p>
            </div>
          </div>
          <ElementalButton 
            element="forest" 
            onClick={() => setCurrentView("map")}
            className="w-full"
          >
            Open World Map
          </ElementalButton>
        </ElementalCard>

        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Gamepad2 className="text-accent" size={32} />
            <div>
              <h3 className="text-xl font-bold">Play Mini-Games</h3>
              <p className="text-muted-foreground">
                Learn through fun activities and earn Eco-Points
              </p>
            </div>
          </div>
          <ElementalButton 
            element="sky" 
            onClick={() => setCurrentView("game")}
            className="w-full"
          >
            Recycle Rush
          </ElementalButton>
        </ElementalCard>

        <ElementalCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="text-river" size={32} />
            <div>
              <h3 className="text-xl font-bold">Test Your Knowledge</h3>
              <p className="text-muted-foreground">
                Answer eco-questions to gain wisdom and XP
              </p>
            </div>
          </div>
          <ElementalButton 
            element="river" 
            onClick={() => setCurrentView("quiz")}
            className="w-full"
          >
            Eco Quiz Challenge
          </ElementalButton>
        </ElementalCard>

        <ElementalCard className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="text-center space-y-3">
            <Sparkles className="mx-auto text-primary" size={32} />
            <h3 className="text-xl font-bold">Real-World Challenges</h3>
            <p className="text-muted-foreground text-sm">
              Complete real environmental actions and upload proof for maximum impact!
            </p>
            <Badge variant="outline" className="animate-pulse">
              Coming Soon
            </Badge>
          </div>
        </ElementalCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderView()}
      </div>

      {/* Footer */}
      {currentView === "home" && (
        <footer className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            🌍 Together, we can restore Terra Nova and protect our real world! 🌱
          </p>
        </footer>
      )}
    </div>
  );
};

export default Index;
