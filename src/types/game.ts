export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "story";
  category: "mini-games" | "progression" | "collection" | "social";
  objectives: QuestObjective[];
  rewards: QuestReward[];
  status: "available" | "active" | "completed" | "locked";
  expiresAt?: Date;
  unlockLevel?: number;
  prerequisiteQuests?: string[];
}

export interface QuestObjective {
  id: string;
  description: string;
  type: "complete-games" | "earn-credits" | "reach-level" | "collect-resources" | "craft-items";
  target: number;
  current: number;
  gameType?: string; // For game-specific objectives
  resourceType?: string; // For resource collection objectives
}

export interface QuestReward {
  type: "bio-credits" | "xp" | "resource" | "item" | "achievement";
  amount?: number;
  resourceType?: string;
  itemId?: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  category: "bio-material" | "energy-core" | "data-fragment" | "synthetic-component";
}

export interface InventoryItem {
  resourceId: string;
  quantity: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  resultItem: string;
  resultQuantity: number;
  requirements: { resourceId: string; quantity: number }[];
  category: "drone-upgrade" | "sanctuary-decoration" | "consumable" | "tool";
  unlockLevel: number;
}

export interface CraftedItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: "drone-upgrade" | "sanctuary-decoration" | "consumable" | "tool";
  effects?: { [key: string]: number };
}

export interface GlobalStats {
  totalPlayers: number;
  totalBioCreditsEarned: number;
  totalPollutionCleansed: number;
  totalDataProcessed: number;
  totalSynthesesCompleted: number;
  totalQuestsCompleted: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  rank: number;
  avatar?: string;
}

export interface GameProgress {
  gamesCompleted: { [gameType: string]: number };
  resourcesCollected: { [resourceId: string]: number };
  itemsCrafted: { [itemId: string]: number };
}
