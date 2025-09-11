import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "gameplay" | "environmental" | "social" | "collection";
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: {
    type: "eco-points" | "xp" | "item" | "title";
    amount?: number;
    item?: string;
  };
}

interface AchievementSystemProps {
  playerStats: {
    gamesPlayed: number;
    quizzesCompleted: number;
    ecoPoints: number;
    level: number;
    dailyStreak: number;
    itemsCollected: number;
  };
  onRewardClaim: (reward: any) => void;
}

export const AchievementSystem = ({ playerStats, onRewardClaim }: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const { toast } = useToast();

  const achievementTemplates: Achievement[] = [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first mini-game",
      category: "gameplay",
      difficulty: "bronze",
      icon: "🎮",
      progress: Math.min(playerStats.gamesPlayed, 1),
      maxProgress: 1,
      unlocked: playerStats.gamesPlayed >= 1,
      reward: { type: "eco-points", amount: 50 }
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Complete 10 eco-quizzes",
      category: "gameplay",
      difficulty: "silver",
      icon: "🧠",
      progress: Math.min(playerStats.quizzesCompleted, 10),
      maxProgress: 10,
      unlocked: playerStats.quizzesCompleted >= 10,
      reward: { type: "xp", amount: 200 }
    },
    {
      id: "eco-warrior",
      title: "Eco Warrior",
      description: "Earn 1000 Eco-Points",
      category: "environmental",
      difficulty: "gold",
      icon: "🌍",
      progress: Math.min(playerStats.ecoPoints, 1000),
      maxProgress: 1000,
      unlocked: playerStats.ecoPoints >= 1000,
      reward: { type: "item", item: "Warrior's Crown" }
    },
    {
      id: "level-up",
      title: "Rising Guardian",
      description: "Reach Level 5",
      category: "gameplay",
      difficulty: "silver",
      icon: "⭐",
      progress: Math.min(playerStats.level, 5),
      maxProgress: 5,
      unlocked: playerStats.level >= 5,
      reward: { type: "eco-points", amount: 150 }
    },
    {
      id: "streak-keeper",
      title: "Streak Keeper",
      description: "Maintain a 7-day login streak",
      category: "social",
      difficulty: "bronze",
      icon: "🔥",
      progress: Math.min(playerStats.dailyStreak, 7),
      maxProgress: 7,
      unlocked: playerStats.dailyStreak >= 7,
      reward: { type: "title", item: "Dedicated Guardian" }
    },
    {
      id: "collector",
      title: "Sanctuary Collector",
      description: "Collect 15 sanctuary items",
      category: "collection",
      difficulty: "gold",
      icon: "🏆",
      progress: Math.min(playerStats.itemsCollected, 15),
      maxProgress: 15,
      unlocked: playerStats.itemsCollected >= 15,
      reward: { type: "eco-points", amount: 300 }
    },
    {
      id: "terra-nova-legend",
      title: "Terra Nova Legend",
      description: "Reach Level 10 and earn 2000 Eco-Points",
      category: "environmental",
      difficulty: "platinum",
      icon: "👑",
      progress: Math.min(playerStats.level >= 10 && playerStats.ecoPoints >= 2000 ? 1 : 0, 1),
      maxProgress: 1,
      unlocked: playerStats.level >= 10 && playerStats.ecoPoints >= 2000,
      reward: { type: "item", item: "Legend's Medallion" }
    }
  ];

  useEffect(() => {
    const updatedAchievements = achievementTemplates.map(template => ({
      ...template,
      progress: getProgressForAchievement(template.id),
      unlocked: checkIfUnlocked(template.id)
    }));

    const newUnlocked = updatedAchievements.filter(
      achievement => achievement.unlocked && 
      !achievements.find(prev => prev.id === achievement.id && prev.unlocked)
    );

    setAchievements(updatedAchievements);
    
    if (newUnlocked.length > 0) {
      setNewlyUnlocked(newUnlocked);
      newUnlocked.forEach(achievement => {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.title} - ${achievement.description}`,
        });
      });
    }
  }, [playerStats]);

  const getProgressForAchievement = (id: string): number => {
    switch (id) {
      case "first-steps": return Math.min(playerStats.gamesPlayed, 1);
      case "quiz-master": return Math.min(playerStats.quizzesCompleted, 10);
      case "eco-warrior": return Math.min(playerStats.ecoPoints, 1000);
      case "level-up": return Math.min(playerStats.level, 5);
      case "streak-keeper": return Math.min(playerStats.dailyStreak, 7);
      case "collector": return Math.min(playerStats.itemsCollected, 15);
      case "terra-nova-legend": return playerStats.level >= 10 && playerStats.ecoPoints >= 2000 ? 1 : 0;
      default: return 0;
    }
  };

  const checkIfUnlocked = (id: string): boolean => {
    switch (id) {
      case "first-steps": return playerStats.gamesPlayed >= 1;
      case "quiz-master": return playerStats.quizzesCompleted >= 10;
      case "eco-warrior": return playerStats.ecoPoints >= 1000;
      case "level-up": return playerStats.level >= 5;
      case "streak-keeper": return playerStats.dailyStreak >= 7;
      case "collector": return playerStats.itemsCollected >= 15;
      case "terra-nova-legend": return playerStats.level >= 10 && playerStats.ecoPoints >= 2000;
      default: return false;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "bronze": return "text-orange-600";
      case "silver": return "text-gray-500";
      case "gold": return "text-yellow-500";
      case "platinum": return "text-purple-500";
      default: return "text-gray-400";
    }
  };

  const categories = [
    { id: "all", name: "All", icon: "🏆" },
    { id: "gameplay", name: "Gameplay", icon: "🎮" },
    { id: "environmental", name: "Environmental", icon: "🌍" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "collection", name: "Collection", icon: "📦" }
  ];

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ElementalCard className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="text-primary animate-bounce" size={32} />
            <h2 className="text-3xl font-bold bg-gradient-terra bg-clip-text text-transparent">
              Achievements
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          
          <Progress value={completionPercentage} className="h-3" />
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
              className={`px-4 py-2 text-sm ${
                selectedCategory === category.id ? "" : "opacity-70"
              }`}
            >
              {category.icon} {category.name}
            </ElementalButton>
          ))}
        </div>
      </ElementalCard>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <ElementalCard 
            key={achievement.id} 
            className={`p-4 transition-all duration-300 ${
              achievement.unlocked ? "border-primary shadow-lg" : "opacity-75"
            }`}
            glowing={achievement.unlocked}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(achievement.difficulty)}
                  >
                    {achievement.difficulty}
                  </Badge>
                  {achievement.unlocked ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Lock className="text-muted-foreground" size={20} />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
              </div>

              {/* Reward */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Reward: {achievement.reward.type === "eco-points" && `${achievement.reward.amount} Eco-Points`}
                  {achievement.reward.type === "xp" && `${achievement.reward.amount} XP`}
                  {achievement.reward.type === "item" && achievement.reward.item}
                  {achievement.reward.type === "title" && `Title: ${achievement.reward.item}`}
                </div>
                
                {achievement.unlocked && (
                  <ElementalButton
                    element="forest"
                    onClick={() => onRewardClaim(achievement.reward)}
                    className="px-3 py-1 text-xs"
                  >
                    Claim
                  </ElementalButton>
                )}
              </div>
            </div>
          </ElementalCard>
        ))}
      </div>

      {/* Newly Unlocked Modal */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ElementalCard className="p-8 text-center space-y-6 max-w-md animate-bounce-in">
            <div className="space-y-2">
              <Trophy className="mx-auto text-primary animate-spin" size={48} />
              <h3 className="text-2xl font-bold">Achievement Unlocked!</h3>
            </div>
            
            {newlyUnlocked.map(achievement => (
              <div key={achievement.id} className="space-y-2">
                <div className="text-4xl">{achievement.icon}</div>
                <h4 className="text-xl font-bold">{achievement.title}</h4>
                <p className="text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
            
            <ElementalButton
              element="sky"
              onClick={() => setNewlyUnlocked([])}
              className="w-full"
            >
              Awesome!
            </ElementalButton>
          </ElementalCard>
        </div>
      )}
    </div>
  );
};
