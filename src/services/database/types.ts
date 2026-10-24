export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'one_piece';

export type ClothingSeason = 'all' | 'spring' | 'summer' | 'fall' | 'winter';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  colorName: string;
  hexCode: string;
  season: ClothingSeason;
  brand?: string;
  imageUri?: string;
  wearCount: number;
  lastWornDate?: string; // ISO date string (YYYY-MM-DD)
  price?: number;
  notes?: string;
  createdAt: string;
}

export interface WearLog {
  id: string;
  clothId: string;
  wornDate: string; // ISO date string
  occasion?: string;
  rating?: number; // 1 to 5
  notes?: string;
  createdAt: string;
}

export interface RecommendedColor {
  name: string;
  hex: string;
  category: 'primary' | 'accent' | 'neutral';
  description: string;
  styleTip: string;
}

export interface AvoidColor {
  name: string;
  hex: string;
  reason: string;
}

export interface SkinToneAnalysis {
  id: string;
  analyzedAt: string;
  skinTone: string; // e.g. "Warm Golden Honey", "Cool Porcelain", "Deep Rich Espresso"
  undertone: 'Warm' | 'Cool' | 'Neutral' | 'Olive';
  contrastLevel: 'High' | 'Medium' | 'Low';
  paletteName: string; // e.g. "Deep Autumn", "Bright Winter", "Light Spring", "Soft Summer"
  paletteDescription: string;
  recommendedColors: RecommendedColor[];
  avoidColors: AvoidColor[];
  wardrobeAdvice: string;
  imageUri?: string;
}

export interface WearStatistics {
  totalItems: number;
  totalWears: number;
  averageWearPerItem: number;
  mostWornItem: ClothingItem | null;
  leastWornItem: ClothingItem | null;
  neglectedItemsCount: number; // Items worn 0 times or not worn in > 30 days
  categoryDistribution: {
    category: ClothingCategory;
    count: number;
    wearCount: number;
  }[];
  recentWearLogs: (WearLog & { clothName: string; hexCode: string; category: ClothingCategory })[];
}
