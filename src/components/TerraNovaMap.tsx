import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Lock } from "lucide-react";
import terranovaImage from "@/assets/terra-nova-map.jpg";
import { cn } from "@/lib/utils";

interface Region {
  id: string;
  name: string;
  element: "forest" | "sky" | "earth" | "river";
  unlocked: boolean;
  progress: number;
  description: string;
}

interface TerraNovaMapProps {
  regions: Region[];
  onRegionSelect: (regionId: string) => void;
}

export const TerraNovaMap = ({ regions, onRegionSelect }: TerraNovaMapProps) => {
  return (
    <div className="relative w-full space-y-6">
      {/* Map Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-terra bg-clip-text text-transparent">
          Terra Nova World Map
        </h1>
        <p className="text-muted-foreground">
          Explore the elemental regions and restore balance to the world
        </p>
      </div>

      {/* Background Map */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
        <img 
          src={terranovaImage}
          alt="Terra Nova - The Elemental World"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />

        {/* Interactive Region Markers */}
        <div className="absolute inset-0 p-8">
          {regions.map((region, index) => (
            <div
              key={region.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getRegionPosition(index)}`}
            >
              <ElementalCard 
                floating={region.unlocked}
                glowing={region.unlocked && region.progress < 100}
                className={cn(
                  "p-4 min-w-[220px] max-w-[280px] animate-scale-in backdrop-blur-sm",
                  region.unlocked ? "bg-card/90" : "bg-card/70"
                )}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      region.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {region.unlocked ? (
                        <MapPin size={20} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{region.name}</h3>
                      <Badge variant={region.unlocked ? "secondary" : "outline"} className="text-xs">
                        {getElementEmoji(region.element)} {region.element}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {region.description}
                  </p>

                  {region.unlocked && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Restoration Progress</span>
                          <span className="font-semibold">{region.progress}%</span>
                        </div>
                        <Progress value={region.progress} className="h-2" />
                      </div>
                      
                      <ElementalButton
                        element={region.element}
                        onClick={() => onRegionSelect(region.id)}
                        className="w-full text-sm py-2"
                        glowing={region.progress < 100}
                      >
                        {region.progress === 100 ? "✅ Completed" : "🚀 Enter Region"}
                      </ElementalButton>
                    </div>
                  )}

                  {!region.unlocked && (
                    <div className="text-center py-2">
                      <Badge variant="outline" className="opacity-70">
                        🔒 Complete previous regions to unlock
                      </Badge>
                    </div>
                  )}
                </div>
              </ElementalCard>
            </div>
          ))}
        </div>
      </div>

      {/* Region Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        {regions.map((region) => (
          <ElementalCard key={region.id} className="p-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl">{getElementEmoji(region.element)}</div>
              <h4 className="font-semibold">{region.name}</h4>
              <div className="text-sm text-muted-foreground">
                {region.unlocked ? `${region.progress}% Complete` : "Locked"}
              </div>
              <Progress value={region.progress} className="h-1" />
            </div>
          </ElementalCard>
        ))}
      </div>
    </div>
  );
};

// Helper function to get element emoji
const getElementEmoji = (element: string) => {
  switch (element) {
    case "forest": return "🌲";
    case "sky": return "☁️";
    case "earth": return "🏔️";
    case "river": return "🌊";
    default: return "🌟";
  }
};

// Helper function to position regions on the map
const getRegionPosition = (index: number) => {
  const positions = [
    "top-[30%] left-[25%]",     // Forest region - Withered Forest
    "top-[20%] right-[20%]",    // Sky region - Clouded Peaks
    "bottom-[35%] left-[30%]",  // Earth region - Silent Mountains
    "bottom-[25%] right-[25%]", // River region - Dried Rivers
  ];
  return positions[index] || "top-1/2 left-1/2";
};
