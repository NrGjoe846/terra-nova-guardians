import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Lock } from "lucide-react";
import terranovaImage from "@/assets/terra-nova-map.jpg";

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
    <div className="relative w-full">
      {/* Background Map */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src={terranovaImage}
          alt="Terra Nova - The Elemental World"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

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
              className="p-4 min-w-[200px] animate-scale-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {region.unlocked ? (
                    <MapPin className="text-primary" size={20} />
                  ) : (
                    <Lock className="text-muted-foreground" size={20} />
                  )}
                  <h3 className="font-bold text-lg">{region.name}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {region.description}
                </p>

                {region.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">
                        {region.progress}% Complete
                      </Badge>
                    </div>
                    
                    <ElementalButton
                      element={region.element}
                      onClick={() => onRegionSelect(region.id)}
                      className="w-full"
                      glowing={region.progress < 100}
                    >
                      Enter {region.name}
                    </ElementalButton>
                  </div>
                )}

                {!region.unlocked && (
                  <Badge variant="outline" className="opacity-50">
                    Locked
                  </Badge>
                )}
              </div>
            </ElementalCard>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to position regions on the map
const getRegionPosition = (index: number) => {
  const positions = [
    "top-1/3 left-1/4",     // Forest region
    "top-1/4 right-1/4",    // Sky region  
    "bottom-1/3 left-1/3",  // Mountain region
    "bottom-1/4 right-1/3", // River region
  ];
  return positions[index] || "top-1/2 left-1/2";
};