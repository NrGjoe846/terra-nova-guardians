import { useState } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, MessageCircle, Share2, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  name: string;
  level: number;
  ecoPoints: number;
  element: "forest" | "sky" | "earth" | "river";
  status: "online" | "offline" | "playing";
  lastActive: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  ecoPoints: number;
  element: "forest" | "sky" | "earth" | "river";
  isPlayer?: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  type: "achievement" | "tip" | "photo" | "question";
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

interface SocialFeaturesProps {
  playerData: {
    name: string;
    level: number;
    ecoPoints: number;
    element: "forest" | "sky" | "earth" | "river";
  };
}

export const SocialFeatures = ({ playerData }: SocialFeaturesProps) => {
  const [activeTab, setActiveTab] = useState("friends");
  const { toast } = useToast();

  const mockFriends: Friend[] = [
    {
      id: "1",
      name: "EcoMaster99",
      level: 8,
      ecoPoints: 1250,
      element: "forest",
      status: "online",
      lastActive: "now"
    },
    {
      id: "2", 
      name: "SkyGuardian",
      level: 6,
      ecoPoints: 890,
      element: "sky",
      status: "playing",
      lastActive: "2 min ago"
    },
    {
      id: "3",
      name: "EarthProtector",
      level: 7,
      ecoPoints: 1100,
      element: "earth",
      status: "offline",
      lastActive: "1 hour ago"
    }
  ];

  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "TerraNova_Hero", level: 12, ecoPoints: 2500, element: "forest" },
    { rank: 2, name: "ClimateChampion", level: 11, ecoPoints: 2200, element: "sky" },
    { rank: 3, name: "GreenWarrior", level: 10, ecoPoints: 1950, element: "earth" },
    { rank: 4, name: playerData.name, level: playerData.level, ecoPoints: playerData.ecoPoints, element: playerData.element, isPlayer: true },
    { rank: 5, name: "OceanSaver", level: 9, ecoPoints: 1600, element: "river" }
  ];

  const mockPosts: CommunityPost[] = [
    {
      id: "1",
      author: "EcoMaster99",
      content: "Just unlocked the Terra Nova Legend achievement! 🏆 The key is consistency with daily challenges!",
      type: "achievement",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      liked: false
    },
    {
      id: "2",
      author: "SkyGuardian", 
      content: "Pro tip: During rainy weather, focus on sanctuary building for bonus eco-points! 🌧️",
      type: "tip",
      likes: 15,
      comments: 3,
      timestamp: "4 hours ago",
      liked: true
    },
    {
      id: "3",
      author: "EarthProtector",
      content: "Check out my sanctuary! Finally got all the rare plants 🌿✨",
      type: "photo",
      likes: 31,
      comments: 12,
      timestamp: "1 day ago",
      liked: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "playing": return "bg-blue-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getElementEmoji = (element: string) => {
    switch (element) {
      case "forest": return "🌲";
      case "sky": return "☁️";
      case "earth": return "🏔️";
      case "river": return "🌊";
      default: return "🌟";
    }
  };

  const handleLikePost = (postId: string) => {
    toast({
      title: "Post Liked! ❤️",
      description: "Your support helps build our eco-community!",
    });
  };

  const handleShareAchievement = () => {
    toast({
      title: "Achievement Shared! 📢",
      description: "Your friends will be inspired by your progress!",
    });
  };

  return (
    <div className="space-y-6">
      <ElementalCard className="p-6">
        <div className="text-center space-y-2">
          <Users className="mx-auto text-primary" size={32} />
          <h2 className="text-2xl font-bold">Guardian Community</h2>
          <p className="text-muted-foreground">
            Connect with fellow Eco-Guardians around the world
          </p>
        </div>
      </ElementalCard>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <ElementalCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Your Friends ({mockFriends.length})</h3>
              <ElementalButton element="sky" className="px-4 py-2 text-sm">
                Add Friends
              </ElementalButton>
            </div>
            
            <div className="space-y-3">
              {mockFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{getElementEmoji(friend.element)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                    </div>
                    
                    <div>
                      <div className="font-semibold">{friend.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Level {friend.level} • {friend.ecoPoints} Eco-Points
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {friend.status === "online" ? "Online now" : 
                         friend.status === "playing" ? "Playing now" : 
                         `Last seen ${friend.lastActive}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <ElementalButton element="forest" className="px-3 py-1 text-xs">
                      Challenge
                    </ElementalButton>
                    <ElementalButton element="river" className="px-3 py-1 text-xs">
                      <MessageCircle size={14} />
                    </ElementalButton>
                  </div>
                </div>
              ))}
            </div>
          </ElementalCard>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <ElementalCard className="p-4">
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold">Global Leaderboard</h3>
              <p className="text-sm text-muted-foreground">
                Top Eco-Guardians this week
              </p>
            </div>
            
            <div className="space-y-2">
              {mockLeaderboard.map(entry => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isPlayer ? "bg-primary/10 border-primary" : "border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? "bg-yellow-500 text-white" :
                      entry.rank === 2 ? "bg-gray-400 text-white" :
                      entry.rank === 3 ? "bg-orange-500 text-white" :
                      "bg-muted"
                    }`}>
                      {entry.rank <= 3 ? <Trophy size={16} /> : entry.rank}
                    </div>
                    
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {entry.name}
                        {entry.isPlayer && <Badge variant="secondary">You</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {entry.level} {getElementEmoji(entry.element)} Guardian
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {entry.ecoPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Eco-Points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ElementalCard>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <ElementalCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Community Feed</h3>
              <ElementalButton element="forest" className="px-4 py-2 text-sm" onClick={handleShareAchievement}>
                <Share2 size={16} className="mr-1" />
                Share
              </ElementalButton>
            </div>
            
            <div className="space-y-4">
              {mockPosts.map(post => (
                <div key={post.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>🌟</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{post.author}</div>
                        <div className="text-xs text-muted-foreground">{post.timestamp}</div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {post.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{post.content}</p>
                  
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart size={16} className={post.liked ? "fill-current" : ""} />
                      {post.likes}
                    </button>
                    
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle size={16} />
                      {post.comments}
                    </button>
                    
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ElementalCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
