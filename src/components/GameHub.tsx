import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/components/GameCard";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Clock, 
  Star,
  Zap,
  Target,
  Recycle,
  Leaf,
  Droplets
} from "lucide-react";

interface GameHubProps {
  onGameSelect: (gameId: string) => void;
  playerLevel: number;
}

export const GameHub = ({ onGameSelect, playerLevel }: GameHubProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "difficulty">("popular");

  const games = [
    {
      id: "recycle-rush",
      title: "Recycle Rush",
      description: "Sort waste items into correct bins as fast as you can! Learn proper recycling while racing against time.",
      image: "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "easy" as const,
      duration: "2-3 min",
      players: "1 Player",
      rewards: { ecoPoints: 50, xp: 25 },
      element: "earth" as const,
      category: "action",
      isLocked: false,
      progress: 75,
      featured: true
    },
    {
      id: "pollution-purge",
      title: "Pollution Purge",
      description: "Clean up polluted environments by removing harmful substances while protecting wildlife.",
      image: "https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "medium" as const,
      duration: "3-5 min",
      players: "1 Player",
      rewards: { ecoPoints: 75, xp: 40 },
      element: "river" as const,
      category: "action",
      isLocked: false,
      progress: 30
    },
    {
      id: "eco-quiz",
      title: "Eco Knowledge Quiz",
      description: "Test your environmental knowledge with challenging questions about climate, wildlife, and sustainability.",
      image: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "medium" as const,
      duration: "5-7 min",
      players: "1 Player",
      rewards: { ecoPoints: 60, xp: 50 },
      element: "forest" as const,
      category: "educational",
      isLocked: false,
      progress: 90
    },
    {
      id: "carbon-calculator",
      title: "Carbon Footprint Challenge",
      description: "Calculate and reduce your carbon footprint through smart lifestyle choices and eco-friendly decisions.",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "hard" as const,
      duration: "10-15 min",
      players: "1 Player",
      rewards: { ecoPoints: 100, xp: 75 },
      element: "sky" as const,
      category: "strategy",
      isLocked: playerLevel < 5,
      progress: 0
    },
    {
      id: "ecosystem-builder",
      title: "Ecosystem Builder",
      description: "Design and balance complex ecosystems by managing species, resources, and environmental factors.",
      image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "hard" as const,
      duration: "15-20 min",
      players: "1-4 Players",
      rewards: { ecoPoints: 150, xp: 100 },
      element: "forest" as const,
      category: "strategy",
      isLocked: playerLevel < 8,
      progress: 0,
      featured: true
    },
    {
      id: "renewable-energy",
      title: "Renewable Energy Tycoon",
      description: "Build and manage renewable energy infrastructure to power sustainable cities of the future.",
      image: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "hard" as const,
      duration: "20-30 min",
      players: "1 Player",
      rewards: { ecoPoints: 200, xp: 125 },
      element: "sky" as const,
      category: "strategy",
      isLocked: playerLevel < 10,
      progress: 0
    }
  ];

  const categories = [
    { id: "all", name: "All Games", icon: Gamepad2, count: games.length },
    { id: "action", name: "Action", icon: Zap, count: games.filter(g => g.category === "action").length },
    { id: "educational", name: "Educational", icon: Star, count: games.filter(g => g.category === "educational").length },
    { id: "strategy", name: "Strategy", icon: Target, count: games.filter(g => g.category === "strategy").length }
  ];

  const filteredGames = selectedCategory === "all" 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.progress - a.progress;
      case "newest":
        return games.indexOf(a) - games.indexOf(b);
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const unlockedGames = games.filter(g => !g.isLocked).length;
  const totalRewards = games.reduce((sum, game) => sum + game.rewards.ecoPoints, 0);

  return (
    <div className="relative min-h-screen">
      <InteractiveBackground theme="forest" intensity="medium" />
      
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <ElementalCard className="p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Gamepad2 className="text-primary animate-bounce" size={40} />
              <h1 className="text-4xl font-bold bg-gradient-terra bg-clip-text text-transparent">
                Game Hub
              </h1>
              <Trophy className="text-accent animate-pulse" size={40} />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master environmental challenges through engaging mini-games and earn rewards to restore Terra Nova!
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{unlockedGames}</div>
                <div className="text-sm text-muted-foreground">Games Unlocked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{totalRewards}</div>
                <div className="text-sm text-muted-foreground">Total Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">Level {playerLevel}</div>
                <div className="text-sm text-muted-foreground">Player Level</div>
              </div>
            </div>
          </div>
        </ElementalCard>

        {/* Filters and Controls */}
        <ElementalCard className="p-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{category.name}</span>
                      <Badge variant="outline" className="ml-1">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="difficulty">By Difficulty</option>
                </select>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedGames.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  image={game.image}
                  difficulty={game.difficulty}
                  duration={game.duration}
                  players={game.players}
                  rewards={game.rewards}
                  element={game.element}
                  isLocked={game.isLocked}
                  progress={game.progress}
                  featured={game.featured}
                  onPlay={() => onGameSelect(game.id)}
                />
              ))}
            </div>
          </Tabs>
        </ElementalCard>

        {/* Daily Challenges */}
        <ElementalCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold">Daily Challenges</h2>
              <Badge className="bg-orange-500 text-white animate-pulse">
                Resets in 4h 23m
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-primary/20 rounded-xl bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <Recycle className="text-primary" size={20} />
                <h3 className="font-semibold">Recycling Master</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Complete 3 Recycle Rush games with 90%+ accuracy
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">Progress: 1/3</Badge>
                <div className="text-sm font-semibold text-primary">+100 🍃</div>
              </div>
            </div>

            <div className="p-4 border border-accent/20 rounded-xl bg-accent/5">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="text-accent" size={20} />
                <h3 className="font-semibold">Knowledge Seeker</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Answer 20 quiz questions correctly
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">Progress: 12/20</Badge>
                <div className="text-sm font-semibold text-accent">+75 ⭐</div>
              </div>
            </div>

            <div className="p-4 border border-river/20 rounded-xl bg-river/5">
              <div className="flex items-center gap-3 mb-3">
                <Droplets className="text-river" size={20} />
                <h3 className="font-semibold">Pollution Fighter</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Clean 50 pollution particles in Pollution Purge
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">Progress: 0/50</Badge>
                <div className="text-sm font-semibold text-river">+150 🍃</div>
              </div>
            </div>
          </div>
        </ElementalCard>

        {/* Leaderboard Preview */}
        <ElementalCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold">Weekly Leaderboard</h2>
            </div>
            <ElementalButton element="sky" className="px-4 py-2 text-sm">
              View Full Leaderboard
            </ElementalButton>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, name: "EcoMaster99", score: 2450, avatar: "🌟" },
              { rank: 2, name: "GreenWarrior", score: 2200, avatar: "🌿" },
              { rank: 3, name: "ClimateHero", score: 1980, avatar: "🌍" },
              { rank: 4, name: "You", score: 1750, avatar: "🧙‍♂️", isPlayer: true },
              { rank: 5, name: "EarthGuardian", score: 1650, avatar: "🌱" }
            ].map((player) => (
              <div 
                key={player.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.isPlayer ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1 ? "bg-yellow-500 text-white" :
                    player.rank === 2 ? "bg-gray-400 text-white" :
                    player.rank === 3 ? "bg-orange-500 text-white" :
                    "bg-muted"
                  }`}>
                    {player.rank <= 3 ? <Trophy size={16} /> : player.rank}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {player.name}
                      {player.isPlayer && <Badge variant="secondary">You</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {player.score.toLocaleString()} points this week
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">#{player.rank}</div>
                </div>
              </div>
            ))}
          </div>
        </ElementalCard>
      </div>
    </div>
  );
};
