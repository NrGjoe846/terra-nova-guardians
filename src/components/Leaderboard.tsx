import { useState, useEffect } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Zap, 
  Target, 
  Database, 
  CircuitBoard,
  TrendingUp,
  User
} from "lucide-react";
import { LeaderboardEntry } from "@/types/game";

interface LeaderboardProps {
  playerName: string;
  playerStats: {
    bioCredits: number;
    level: number;
    gamesCompleted: number;
    questsCompleted: number;
  };
}

export const Leaderboard = ({ playerName, playerStats }: LeaderboardProps) => {
  const [leaderboards, setLeaderboards] = useState<{
    bioCredits: LeaderboardEntry[];
    level: LeaderboardEntry[];
    gamesCompleted: LeaderboardEntry[];
    questsCompleted: LeaderboardEntry[];
  }>({
    bioCredits: [],
    level: [],
    gamesCompleted: [],
    questsCompleted: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bioCredits");

  // Generate mock leaderboard data
  useEffect(() => {
    const generateMockData = () => {
      const guardianNames = [
        "EcoMaster_2024", "GreenThumb_Pro", "BioSynth_Hero", "TerraGuardian", 
        "NatureDefender", "EcoWarrior_X", "PlantWhisperer", "GreenEnergy_99",
        "BioHacker_Elite", "EcoNinja_2024", "ForestProtector", "CleanAir_Champion",
        "WaterGuardian", "SolarPower_Max", "RecycleKing", "EcoFriendly_AI",
        "GreenTech_Guru", "BioDiversity_Pro", "ClimateHero_2024", "EcoSaver_Prime"
      ];

      const generateLeaderboard = (baseScore: number, variance: number): LeaderboardEntry[] => {
        const entries: LeaderboardEntry[] = [];
        
        // Add player to leaderboard
        const playerScore = playerStats[activeTab as keyof typeof playerStats] || 0;
        
        for (let i = 0; i < 20; i++) {
          const isPlayer = Math.random() > 0.7 && entries.length < 15; // 30% chance player appears in top 15
          
          if (isPlayer && !entries.some(e => e.playerName === playerName)) {
            entries.push({
              playerId: "player",
              playerName: playerName,
              score: playerScore,
              rank: i + 1,
              avatar: "🤖"
            });
          } else {
            const score = Math.max(0, baseScore - (i * variance) + Math.random() * variance);
            entries.push({
              playerId: `player_${i}`,
              playerName: guardianNames[i % guardianNames.length],
              score: Math.floor(score),
              rank: i + 1,
              avatar: ["🌱", "🌿", "🌳", "🍃", "🌺", "🌸", "🌼", "🌻"][Math.floor(Math.random() * 8)]
            });
          }
        }

        // Sort by score and update ranks
        entries.sort((a, b) => b.score - a.score);
        entries.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        return entries;
      };

      setLeaderboards({
        bioCredits: generateLeaderboard(5000, 200),
        level: generateLeaderboard(15, 1),
        gamesCompleted: generateLeaderboard(100, 5),
        questsCompleted: generateLeaderboard(50, 3)
      });

      setIsLoading(false);
    };

    const timer = setTimeout(generateMockData, 1000);
    return () => clearTimeout(timer);
  }, [playerName, playerStats, activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={20} />;
      case 2: return <Medal className="text-gray-300" size={20} />;
      case 3: return <Medal className="text-amber-600" size={20} />;
      default: return <Trophy className="text-muted-foreground" size={16} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case 2: return "text-gray-300 bg-gray-300/10 border-gray-300/30";
      case 3: return "text-amber-600 bg-amber-600/10 border-amber-600/30";
      default: return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "bioCredits": return <Zap className="text-primary" size={16} />;
      case "level": return <TrendingUp className="text-accent" size={16} />;
      case "gamesCompleted": return <Target className="text-secondary" size={16} />;
      case "questsCompleted": return <Database className="text-river" size={16} />;
      default: return <Trophy className="text-muted-foreground" size={16} />;
    }
  };

  const formatScore = (score: number, category: string) => {
    switch (category) {
      case "bioCredits":
        return score >= 1000 ? `${(score / 1000).toFixed(1)}K` : score.toLocaleString();
      default:
        return score.toLocaleString();
    }
  };

  const getScoreLabel = (category: string) => {
    switch (category) {
      case "bioCredits": return "Bio-Credits";
      case "level": return "Level";
      case "gamesCompleted": return "Games";
      case "questsCompleted": return "Quests";
      default: return "Score";
    }
  };

  const renderLeaderboard = (entries: LeaderboardEntry[], category: string) => (
    <ScrollArea className="h-[500px]">
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const isPlayer = entry.playerName === playerName;
          
          return (
            <BioSynthCard 
              key={entry.playerId}
              className={`p-4 transition-all duration-200 ${
                isPlayer ? 'border-primary neon-glow bg-primary/5' : 'hud-panel'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${getRankColor(entry.rank)}`}>
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                      <span className="text-sm font-bold">#{entry.rank}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <div>
                      <div className={`font-semibold ${isPlayer ? 'text-primary holo-text' : ''}`}>
                        {entry.playerName}
                        {isPlayer && <span className="ml-2 text-xs">(You)</span>}
                      </div>
                      {entry.rank <= 3 && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {entry.rank === 1 ? "Champion" : entry.rank === 2 ? "Elite" : "Expert"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {formatScore(entry.score, category)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getScoreLabel(category)}
                  </div>
                </div>
              </div>
            </BioSynthCard>
          );
        })}
      </div>
    </ScrollArea>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BioSynthCard className="p-6 text-center hud-panel">
          <div className="space-y-4">
            <Trophy className="mx-auto text-primary animate-energy-pulse" size={48} />
            <h2 className="text-2xl font-bold text-primary bio-synth-title">Leaderboards</h2>
            <div className="space-y-2">
              <div className="animate-pulse bg-muted h-4 rounded"></div>
              <div className="animate-pulse bg-muted h-4 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </BioSynthCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BioSynthCard className="p-6 text-center hud-panel">
        <div className="space-y-2">
          <Trophy className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">Leaderboards</h2>
          <p className="text-muted-foreground">
            Compete with other Bio-Synth Guardians and climb the ranks!
          </p>
        </div>
      </BioSynthCard>

      {/* Player Stats Summary */}
      <BioSynthCard className="p-6 hud-panel">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <User className="text-primary" size={24} />
            <h3 className="text-xl font-bold holo-text">Your Rankings</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(leaderboards).map(([category, entries]) => {
              const playerEntry = entries.find(e => e.playerName === playerName);
              const rank = playerEntry?.rank || "Unranked";
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {getTabIcon(category)}
                    <span className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    #{rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BioSynthCard>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bioCredits" className="flex items-center gap-1">
            <Zap size={14} />
            <span className="hidden sm:inline">Bio-Credits</span>
          </TabsTrigger>
          <TabsTrigger value="level" className="flex items-center gap-1">
            <TrendingUp size={14} />
            <span className="hidden sm:inline">Level</span>
          </TabsTrigger>
          <TabsTrigger value="gamesCompleted" className="flex items-center gap-1">
            <Target size={14} />
            <span className="hidden sm:inline">Games</span>
          </TabsTrigger>
          <TabsTrigger value="questsCompleted" className="flex items-center gap-1">
            <Database size={14} />
            <span className="hidden sm:inline">Quests</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bioCredits">
          {renderLeaderboard(leaderboards.bioCredits, "bioCredits")}
        </TabsContent>

        <TabsContent value="level">
          {renderLeaderboard(leaderboards.level, "level")}
        </TabsContent>

        <TabsContent value="gamesCompleted">
          {renderLeaderboard(leaderboards.gamesCompleted, "gamesCompleted")}
        </TabsContent>

        <TabsContent value="questsCompleted">
          {renderLeaderboard(leaderboards.questsCompleted, "questsCompleted")}
        </TabsContent>
      </Tabs>
    </div>
  );
};
