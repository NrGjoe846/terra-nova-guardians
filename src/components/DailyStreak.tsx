import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Flame, Gift, Star } from "lucide-react";

interface DailyReward {
  day: number;
  type: "eco-points" | "xp" | "companion-boost" | "rare-item";
  amount?: number;
  item?: string;
  claimed: boolean;
}

interface DailyStreakProps {
  currentStreak: number;
  onRewardClaim: (reward: DailyReward) => void;
}

export const DailyStreak = ({ currentStreak, onRewardClaim }: DailyStreakProps) => {
  const [showRewardWheel, setShowRewardWheel] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [todaysClaimed, setTodaysClaimed] = useState(false);

  const weeklyRewards: DailyReward[] = [
    { day: 1, type: "eco-points", amount: 50, claimed: currentStreak >= 1 },
    { day: 2, type: "xp", amount: 25, claimed: currentStreak >= 2 },
    { day: 3, type: "eco-points", amount: 75, claimed: currentStreak >= 3 },
    { day: 4, type: "companion-boost", item: "Energy Boost", claimed: currentStreak >= 4 },
    { day: 5, type: "eco-points", amount: 100, claimed: currentStreak >= 5 },
    { day: 6, type: "xp", amount: 50, claimed: currentStreak >= 6 },
    { day: 7, type: "rare-item", item: "Golden Leaf Crown", claimed: currentStreak >= 7 }
  ];

  const getRewardIcon = (reward: DailyReward) => {
    switch (reward.type) {
      case "eco-points": return "🍃";
      case "xp": return "⭐";
      case "companion-boost": return "⚡";
      case "rare-item": return "👑";
      default: return "🎁";
    }
  };

  const getRewardDescription = (reward: DailyReward) => {
    switch (reward.type) {
      case "eco-points": return `${reward.amount} Eco-Points`;
      case "xp": return `${reward.amount} XP`;
      case "companion-boost": return reward.item || "Companion Boost";
      case "rare-item": return reward.item || "Rare Item";
      default: return "Mystery Reward";
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalAngle = spins * 360 + Math.random() * 360;
    setSpinAngle(finalAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      setShowRewardWheel(false);
      setTodaysClaimed(true);
      
      // Determine reward based on where wheel stopped
      const rewardIndex = Math.floor(Math.random() * weeklyRewards.length);
      const reward = weeklyRewards[rewardIndex];
      onRewardClaim(reward);
    }, 3000);
  };

  const canClaimToday = currentStreak > 0 && !todaysClaimed;
  const nextMilestone = Math.ceil((currentStreak + 1) / 7) * 7;
  const progressToNextMilestone = ((currentStreak % 7) / 7) * 100;

  return (
    <>
      <ElementalCard className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Flame className="text-orange-500 animate-pulse" size={24} />
            <h3 className="text-xl font-bold">Daily Streak</h3>
            <Flame className="text-orange-500 animate-pulse" size={24} />
          </div>
          <div className="text-3xl font-bold text-primary">
            {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
          </div>
          <p className="text-muted-foreground text-sm">
            Keep the streak alive by logging in daily!
          </p>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress to next milestone</span>
            <span className="text-sm text-muted-foreground">
              {currentStreak % 7}/7 days
            </span>
          </div>
          <Progress value={progressToNextMilestone} className="h-3" />
          <div className="text-center text-sm text-muted-foreground">
            Next milestone: {nextMilestone} days
          </div>
        </div>

        {/* Weekly Reward Track */}
        <div className="space-y-3">
          <h4 className="font-semibold text-center">This Week's Rewards</h4>
          <div className="grid grid-cols-7 gap-2">
            {weeklyRewards.map((reward) => (
              <div 
                key={reward.day}
                className={cn(
                  "relative p-3 rounded-lg text-center transition-all duration-300",
                  reward.claimed 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : currentStreak + 1 === reward.day 
                      ? "bg-primary/20 border-2 border-primary animate-pulse"
                      : "bg-muted"
                )}
              >
                <div className="text-2xl mb-1">{getRewardIcon(reward)}</div>
                <div className="text-xs font-medium">Day {reward.day}</div>
                
                {reward.claimed && (
                  <div className="absolute -top-1 -right-1 text-green-500">
                    <div className="bg-background rounded-full p-1">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Claim Button */}
        {canClaimToday && (
          <div className="text-center space-y-3">
            <div className="text-sm text-muted-foreground">
              Today's reward is ready!
            </div>
            <ElementalButton
              element="forest"
              onClick={() => setShowRewardWheel(true)}
              glowing
              className="w-full"
            >
              <Gift className="mr-2" size={20} />
              Claim Daily Reward
            </ElementalButton>
          </div>
        )}

        {todaysClaimed && (
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-primary font-semibold">
              ✅ Today's reward claimed!
            </div>
            <div className="text-sm text-muted-foreground">
              Come back tomorrow for your next reward
            </div>
          </div>
        )}
      </ElementalCard>

      {/* Reward Wheel Modal */}
      {showRewardWheel && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ElementalCard className="p-8 text-center space-y-6 max-w-md">
            <h3 className="text-2xl font-bold">🎡 Spin the Reward Wheel!</h3>
            
            <div className="relative">
              {/* Wheel */}
              <div 
                className="w-48 h-48 mx-auto rounded-full border-8 border-primary relative overflow-hidden transition-transform duration-3000 ease-out"
                style={{ transform: `rotate(${spinAngle}deg)` }}
              >
                {/* Wheel segments */}
                {weeklyRewards.map((reward, index) => {
                  const rotation = (index * 360) / weeklyRewards.length;
                  return (
                    <div
                      key={reward.day}
                      className="absolute w-full h-full"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl">
                        {getRewardIcon(reward)}
                      </div>
                    </div>
                  );
                })}
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Star className="text-primary-foreground" size={20} />
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
              </div>
            </div>

            <ElementalButton
              element="sky"
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="w-full"
            >
              {isSpinning ? "Spinning..." : "Spin!"}
            </ElementalButton>
          </ElementalCard>
        </div>
      )}
    </>
  );
};
