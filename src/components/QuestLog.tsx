import { useState, useEffect } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Target, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Zap, 
  Gift,
  Calendar,
  Trophy
} from "lucide-react";
import { Quest, QuestObjective, QuestReward } from "@/types/game";
import { useToast } from "@/hooks/use-toast";

interface QuestLogProps {
  playerLevel: number;
  bioCredits: number;
  gameProgress: any;
  onQuestComplete: (quest: Quest) => void;
  onQuestActivate: (questId: string) => void;
}

export const QuestLog = ({ 
  playerLevel, 
  bioCredits, 
  gameProgress, 
  onQuestComplete, 
  onQuestActivate 
}: QuestLogProps) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();

  // Initialize quests
  useEffect(() => {
    const initialQuests: Quest[] = [
      // Daily Quests
      {
        id: "daily-decontamination",
        title: "Daily System Purge",
        description: "Complete 3 decontamination protocols to maintain system integrity",
        type: "daily",
        category: "mini-games",
        objectives: [{
          id: "decontaminate-3",
          description: "Complete 3 Decontamination Protocols",
          type: "complete-games",
          target: 3,
          current: gameProgress.gamesCompleted?.decontaminate || 0,
          gameType: "decontaminate"
        }],
        rewards: [
          { type: "bio-credits", amount: 150 },
          { type: "xp", amount: 50 },
          { type: "resource", resourceType: "bio-material", amount: 2 }
        ],
        status: "active",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: "daily-data-stream",
        title: "Data Stream Analysis",
        description: "Process environmental data to earn system credits",
        type: "daily",
        category: "mini-games",
        objectives: [{
          id: "data-stream-2",
          description: "Complete 2 Data Stream Duels",
          type: "complete-games",
          target: 2,
          current: gameProgress.gamesCompleted?.datastream || 0,
          gameType: "datastream"
        }],
        rewards: [
          { type: "bio-credits", amount: 100 },
          { type: "resource", resourceType: "data-fragment", amount: 3 }
        ],
        status: "active",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      // Weekly Quests
      {
        id: "weekly-bio-synthesis",
        title: "Master Bio-Synthesist",
        description: "Demonstrate mastery of bio-synthesis protocols",
        type: "weekly",
        category: "mini-games",
        objectives: [{
          id: "bioforge-10",
          description: "Complete 10 Bio-Forge Synthesis sessions",
          type: "complete-games",
          target: 10,
          current: gameProgress.gamesCompleted?.bioforge || 0,
          gameType: "bioforge"
        }],
        rewards: [
          { type: "bio-credits", amount: 500 },
          { type: "xp", amount: 200 },
          { type: "resource", resourceType: "energy-core", amount: 1 }
        ],
        status: "active",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      // Story Quests
      {
        id: "story-guardian-awakening",
        title: "Guardian Awakening",
        description: "Begin your journey as a Bio-Synth Guardian of Terra Nova",
        type: "story",
        category: "progression",
        objectives: [
          {
            id: "reach-level-5",
            description: "Reach Guardian Level 5",
            type: "reach-level",
            target: 5,
            current: playerLevel
          },
          {
            id: "earn-1000-credits",
            description: "Earn 1000 Bio-Credits",
            type: "earn-credits",
            target: 1000,
            current: bioCredits
          }
        ],
        rewards: [
          { type: "item", itemId: "guardian-badge" },
          { type: "bio-credits", amount: 300 },
          { type: "achievement", itemId: "guardian-awakened" }
        ],
        status: playerLevel >= 3 ? "active" : "locked",
        unlockLevel: 3
      },
      {
        id: "story-system-restoration",
        title: "System Restoration Initiative",
        description: "Help restore Terra Nova's critical bio-synthetic systems",
        type: "story",
        category: "collection",
        objectives: [
          {
            id: "collect-bio-materials",
            description: "Collect 20 Bio-Materials",
            type: "collect-resources",
            target: 20,
            current: gameProgress.resourcesCollected?.["bio-material"] || 0,
            resourceType: "bio-material"
          },
          {
            id: "collect-energy-cores",
            description: "Collect 5 Energy Cores",
            type: "collect-resources",
            target: 5,
            current: gameProgress.resourcesCollected?.["energy-core"] || 0,
            resourceType: "energy-core"
          }
        ],
        rewards: [
          { type: "bio-credits", amount: 750 },
          { type: "item", itemId: "system-key" },
          { type: "xp", amount: 300 }
        ],
        status: playerLevel >= 5 ? "active" : "locked",
        unlockLevel: 5
      }
    ];

    setQuests(initialQuests);
  }, [playerLevel, bioCredits, gameProgress]);

  // Update quest progress
  useEffect(() => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        const updatedObjectives = quest.objectives.map(objective => {
          let current = objective.current;
          
          switch (objective.type) {
            case "complete-games":
              current = gameProgress.gamesCompleted?.[objective.gameType!] || 0;
              break;
            case "earn-credits":
              current = bioCredits;
              break;
            case "reach-level":
              current = playerLevel;
              break;
            case "collect-resources":
              current = gameProgress.resourcesCollected?.[objective.resourceType!] || 0;
              break;
          }
          
          return { ...objective, current };
        });

        const isCompleted = updatedObjectives.every(obj => obj.current >= obj.target);
        const newStatus = isCompleted && quest.status === "active" ? "completed" : quest.status;

        if (newStatus === "completed" && quest.status === "active") {
          onQuestComplete(quest);
        }

        return {
          ...quest,
          objectives: updatedObjectives,
          status: newStatus
        };
      })
    );
  }, [gameProgress, bioCredits, playerLevel, onQuestComplete]);

  const getQuestIcon = (quest: Quest) => {
    switch (quest.type) {
      case "daily": return <Calendar className="text-primary" size={20} />;
      case "weekly": return <Clock className="text-accent" size={20} />;
      case "story": return <BookOpen className="text-secondary" size={20} />;
      default: return <Target className="text-muted-foreground" size={20} />;
    }
  };

  const getRewardIcon = (reward: QuestReward) => {
    switch (reward.type) {
      case "bio-credits": return <Zap className="text-primary" size={16} />;
      case "xp": return <Trophy className="text-accent" size={16} />;
      case "resource": return <Gift className="text-secondary" size={16} />;
      case "item": return <Gift className="text-river" size={16} />;
      default: return <Gift className="text-muted-foreground" size={16} />;
    }
  };

  const formatReward = (reward: QuestReward) => {
    switch (reward.type) {
      case "bio-credits":
        return `${reward.amount} Bio-Credits`;
      case "xp":
        return `${reward.amount} XP`;
      case "resource":
        return `${reward.amount} ${reward.resourceType?.replace('-', ' ')}`;
      case "item":
        return reward.itemId?.replace('-', ' ');
      default:
        return "Unknown Reward";
    }
  };

  const activeQuests = quests.filter(q => q.status === "active");
  const completedQuests = quests.filter(q => q.status === "completed");
  const availableQuests = quests.filter(q => q.status === "available");

  const renderQuest = (quest: Quest) => (
    <BioSynthCard key={quest.id} className="p-4 hud-panel">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getQuestIcon(quest)}
            <div>
              <h4 className="font-bold text-lg holo-text">{quest.title}</h4>
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={quest.type === "daily" ? "default" : quest.type === "weekly" ? "secondary" : "outline"}>
              {quest.type}
            </Badge>
            {quest.status === "completed" && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle size={12} className="mr-1" />
                Complete
              </Badge>
            )}
            {quest.status === "locked" && (
              <Badge variant="outline">
                <Lock size={12} className="mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-2">
          {quest.objectives.map(objective => {
            const progress = Math.min((objective.current / objective.target) * 100, 100);
            return (
              <div key={objective.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{objective.description}</span>
                  <span className="text-muted-foreground">
                    {objective.current}/{objective.target}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Rewards */}
        <div className="space-y-2">
          <h5 className="font-semibold text-sm holo-text">Rewards:</h5>
          <div className="flex flex-wrap gap-2">
            {quest.rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1">
                {getRewardIcon(reward)}
                <span className="text-xs font-medium">{formatReward(reward)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiration */}
        {quest.expiresAt && quest.status === "active" && (
          <div className="text-xs text-muted-foreground">
            Expires: {quest.expiresAt.toLocaleDateString()}
          </div>
        )}

        {/* Actions */}
        {quest.status === "available" && (
          <BioSynthButton 
            variant="bio-energy" 
            onClick={() => onQuestActivate(quest.id)}
            className="w-full"
          >
            Accept Quest
          </BioSynthButton>
        )}
      </div>
    </BioSynthCard>
  );

  return (
    <div className="space-y-6">
      <BioSynthCard className="p-6 text-center hud-panel">
        <div className="space-y-2">
          <Target className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">Quest Log</h2>
          <p className="text-muted-foreground">
            Complete missions to earn rewards and progress your Guardian journey
          </p>
        </div>
      </BioSynthCard>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeQuests.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableQuests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedQuests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {activeQuests.length > 0 ? (
                activeQuests.map(renderQuest)
              ) : (
                <BioSynthCard className="p-8 text-center">
                  <p className="text-muted-foreground">No active quests. Check available quests to get started!</p>
                </BioSynthCard>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {availableQuests.length > 0 ? (
                availableQuests.map(renderQuest)
              ) : (
                <BioSynthCard className="p-8 text-center">
                  <p className="text-muted-foreground">No available quests at your current level.</p>
                </BioSynthCard>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {completedQuests.length > 0 ? (
                completedQuests.map(renderQuest)
              ) : (
                <BioSynthCard className="p-8 text-center">
                  <p className="text-muted-foreground">No completed quests yet. Start completing active quests!</p>
                </BioSynthCard>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
