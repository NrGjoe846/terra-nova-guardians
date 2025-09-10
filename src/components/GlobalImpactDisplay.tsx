import { useState, useEffect } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Users, 
  Zap, 
  Trash2, 
  Database, 
  CircuitBoard,
  TrendingUp,
  Award
} from "lucide-react";
import { GlobalStats } from "@/types/game";

interface GlobalImpactDisplayProps {
  playerContribution: {
    bioCreditsEarned: number;
    pollutionCleansed: number;
    dataProcessed: number;
    synthesesCompleted: number;
  };
}

export const GlobalImpactDisplay = ({ playerContribution }: GlobalImpactDisplayProps) => {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalPlayers: 12847,
    totalBioCreditsEarned: 2847392,
    totalPollutionCleansed: 156789,
    totalDataProcessed: 892456,
    totalSynthesesCompleted: 45623,
    totalQuestsCompleted: 78934
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading global stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setGlobalStats(prev => ({
        ...prev,
        totalBioCreditsEarned: prev.totalBioCreditsEarned + Math.floor(Math.random() * 100),
        totalPollutionCleansed: prev.totalPollutionCleansed + Math.floor(Math.random() * 10),
        totalDataProcessed: prev.totalDataProcessed + Math.floor(Math.random() * 50),
        totalSynthesesCompleted: prev.totalSynthesesCompleted + Math.floor(Math.random() * 5),
        totalQuestsCompleted: prev.totalQuestsCompleted + Math.floor(Math.random() * 8)
      }));
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const calculatePlayerPercentage = (playerValue: number, globalValue: number) => {
    return ((playerValue / globalValue) * 100).toFixed(3);
  };

  const getImpactLevel = () => {
    const totalContribution = 
      playerContribution.bioCreditsEarned + 
      playerContribution.pollutionCleansed * 10 + 
      playerContribution.dataProcessed * 5 + 
      playerContribution.synthesesCompleted * 20;

    if (totalContribution >= 10000) return { level: "Legendary Guardian", color: "text-purple-400" };
    if (totalContribution >= 5000) return { level: "Elite Guardian", color: "text-blue-400" };
    if (totalContribution >= 2000) return { level: "Advanced Guardian", color: "text-green-400" };
    if (totalContribution >= 500) return { level: "Guardian", color: "text-yellow-400" };
    return { level: "Novice Guardian", color: "text-gray-400" };
  };

  const impactLevel = getImpactLevel();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BioSynthCard className="p-6 text-center hud-panel">
          <div className="space-y-4">
            <Globe className="mx-auto text-primary animate-energy-pulse" size={48} />
            <h2 className="text-2xl font-bold text-primary bio-synth-title">Global Impact</h2>
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
          <Globe className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">Global Impact</h2>
          <p className="text-muted-foreground">
            See the collective environmental impact of all Bio-Synth Guardians
          </p>
        </div>
      </BioSynthCard>

      {/* Player Impact Level */}
      <BioSynthCard className="p-6 hud-panel">
        <div className="text-center space-y-4">
          <Award className={`mx-auto ${impactLevel.color} animate-energy-pulse`} size={40} />
          <div>
            <h3 className="text-xl font-bold holo-text">Your Impact Level</h3>
            <p className={`text-lg font-semibold ${impactLevel.color}`}>
              {impactLevel.level}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-primary font-bold">
                {formatNumber(playerContribution.bioCreditsEarned)}
              </div>
              <div className="text-muted-foreground">Bio-Credits</div>
            </div>
            <div className="space-y-1">
              <div className="text-accent font-bold">
                {formatNumber(playerContribution.pollutionCleansed)}
              </div>
              <div className="text-muted-foreground">Pollution Cleansed</div>
            </div>
            <div className="space-y-1">
              <div className="text-secondary font-bold">
                {formatNumber(playerContribution.dataProcessed)}
              </div>
              <div className="text-muted-foreground">Data Processed</div>
            </div>
            <div className="space-y-1">
              <div className="text-river font-bold">
                {formatNumber(playerContribution.synthesesCompleted)}
              </div>
              <div className="text-muted-foreground">Syntheses</div>
            </div>
          </div>
        </div>
      </BioSynthCard>

      {/* Global Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <BioSynthCard className="p-6 hud-panel">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="text-primary animate-circuit-pulse" size={24} />
              <h3 className="text-lg font-bold holo-text">Active Guardians</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {formatNumber(globalStats.totalPlayers)}
              </div>
              <p className="text-sm text-muted-foreground">
                Guardians protecting Terra Nova
              </p>
            </div>
          </div>
        </BioSynthCard>

        <BioSynthCard className="p-6 hud-panel">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-accent animate-circuit-pulse" size={24} />
              <h3 className="text-lg font-bold holo-text">Quests Completed</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {formatNumber(globalStats.totalQuestsCompleted)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total missions accomplished
              </p>
            </div>
          </div>
        </BioSynthCard>
      </div>

      {/* Detailed Impact Metrics */}
      <BioSynthCard className="p-6 hud-panel">
        <h3 className="text-lg font-bold holo-text mb-4">Collective Environmental Impact</h3>
        <div className="space-y-6">
          {/* Bio-Credits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                <span className="font-semibold">Bio-Credits Generated</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">
                  {formatNumber(globalStats.totalBioCreditsEarned)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Your contribution: {calculatePlayerPercentage(playerContribution.bioCreditsEarned, globalStats.totalBioCreditsEarned)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(playerContribution.bioCreditsEarned / globalStats.totalBioCreditsEarned) * 100} 
              className="h-2" 
            />
          </div>

          {/* Pollution Cleansed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="text-accent" size={20} />
                <span className="font-semibold">Pollution Cleansed</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-accent">
                  {formatNumber(globalStats.totalPollutionCleansed)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Your contribution: {calculatePlayerPercentage(playerContribution.pollutionCleansed, globalStats.totalPollutionCleansed)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(playerContribution.pollutionCleansed / globalStats.totalPollutionCleansed) * 100} 
              className="h-2" 
            />
          </div>

          {/* Data Processed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="text-secondary" size={20} />
                <span className="font-semibold">Data Processed</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-secondary">
                  {formatNumber(globalStats.totalDataProcessed)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Your contribution: {calculatePlayerPercentage(playerContribution.dataProcessed, globalStats.totalDataProcessed)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(playerContribution.dataProcessed / globalStats.totalDataProcessed) * 100} 
              className="h-2" 
            />
          </div>

          {/* Bio-Syntheses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircuitBoard className="text-river" size={20} />
                <span className="font-semibold">Bio-Syntheses Completed</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-river">
                  {formatNumber(globalStats.totalSynthesesCompleted)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Your contribution: {calculatePlayerPercentage(playerContribution.synthesesCompleted, globalStats.totalSynthesesCompleted)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(playerContribution.synthesesCompleted / globalStats.totalSynthesesCompleted) * 100} 
              className="h-2" 
            />
          </div>
        </div>
      </BioSynthCard>

      {/* Environmental Recovery Status */}
      <BioSynthCard className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 hud-panel circuit-overlay">
        <div className="text-center space-y-4">
          <Globe className="mx-auto text-primary animate-energy-pulse" size={40} />
          <h3 className="text-xl font-bold holo-text">Terra Nova Recovery Status</h3>
          <div className="space-y-2">
            <Progress value={67} className="h-4" />
            <p className="text-lg font-semibold text-primary">67% Restored</p>
            <p className="text-sm text-muted-foreground">
              Thanks to the collective efforts of all Bio-Synth Guardians, Terra Nova's ecosystem is steadily recovering!
            </p>
          </div>
          <Badge variant="secondary" className="animate-pulse">
            System Status: Improving
          </Badge>
        </div>
      </BioSynthCard>
    </div>
  );
};
