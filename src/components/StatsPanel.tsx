import { useState, useEffect } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Leaf, 
  Droplets, 
  Mountain, 
  Cloud,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from "recharts";

interface StatsPanelProps {
  playerData: {
    level: number;
    ecoPoints: number;
    xp: number;
    dailyStreak: number;
    gamesPlayed: number;
    achievements: string[];
  };
}

export const StatsPanel = ({ playerData }: StatsPanelProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  const [animatedStats, setAnimatedStats] = useState({
    ecoPoints: 0,
    xp: 0,
    gamesPlayed: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        ecoPoints: Math.floor(playerData.ecoPoints * easeOut),
        xp: Math.floor(playerData.xp * easeOut),
        gamesPlayed: Math.floor(playerData.gamesPlayed * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats({
          ecoPoints: playerData.ecoPoints,
          xp: playerData.xp,
          gamesPlayed: playerData.gamesPlayed
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [playerData]);

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", ecoPoints: 45, xp: 23 },
    { day: "Tue", ecoPoints: 67, xp: 34 },
    { day: "Wed", ecoPoints: 89, xp: 45 },
    { day: "Thu", ecoPoints: 123, xp: 67 },
    { day: "Fri", ecoPoints: 156, xp: 78 },
    { day: "Sat", ecoPoints: 189, xp: 89 },
    { day: "Sun", ecoPoints: 234, xp: 112 }
  ];

  const elementalProgress = [
    { name: "Forest", value: 85, color: "#22c55e", icon: Leaf },
    { name: "Sky", value: 45, color: "#3b82f6", icon: Cloud },
    { name: "Earth", value: 30, color: "#f59e0b", icon: Mountain },
    { name: "River", value: 60, color: "#06b6d4", icon: Droplets }
  ];

  const achievementData = [
    { name: "Completed", value: playerData.achievements.length, color: "#22c55e" },
    { name: "In Progress", value: 3, color: "#f59e0b" },
    { name: "Locked", value: 8, color: "#6b7280" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ElementalCard className="p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative z-10">
            <Leaf className="mx-auto text-primary mb-2" size={24} />
            <div className="text-2xl font-bold text-primary">
              {animatedStats.ecoPoints.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Eco-Points</div>
          </div>
        </ElementalCard>

        <ElementalCard className="p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="relative z-10">
            <Award className="mx-auto text-accent mb-2" size={24} />
            <div className="text-2xl font-bold text-accent">
              {animatedStats.xp.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
        </ElementalCard>

        <ElementalCard className="p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
          <div className="relative z-10">
            <Target className="mx-auto text-orange-500 mb-2" size={24} />
            <div className="text-2xl font-bold text-orange-500">
              {animatedStats.gamesPlayed}
            </div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </div>
        </ElementalCard>

        <ElementalCard className="p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <div className="relative z-10">
            <Calendar className="mx-auto text-purple-500 mb-2" size={24} />
            <div className="text-2xl font-bold text-purple-500">
              {playerData.dailyStreak}
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </ElementalCard>
      </div>

      {/* Detailed Analytics */}
      <ElementalCard className="p-6">
        <Tabs defaultValue="progress" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp size={16} />
              Progress
            </TabsTrigger>
            <TabsTrigger value="elements" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Elements
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <PieChart size={16} />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
              <div className="flex gap-2">
                {["week", "month", "year"].map((period) => (
                  <Badge
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedPeriod(period as any)}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="ecoPoints" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            <h3 className="text-lg font-semibold">Elemental Mastery</h3>
            <div className="space-y-4">
              {elementalProgress.map((element) => {
                const Icon = element.icon;
                return (
                  <div key={element.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={20} style={{ color: element.color }} />
                        <span className="font-medium">{element.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{element.value}%</span>
                    </div>
                    <Progress 
                      value={element.value} 
                      className="h-3"
                      style={{ 
                        background: `${element.color}20`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <h3 className="text-lg font-semibold">Achievement Overview</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={achievementData}>
                      {achievementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {achievementData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ElementalCard>
    </div>
  );
};
