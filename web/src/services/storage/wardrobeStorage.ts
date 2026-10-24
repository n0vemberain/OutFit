import { ClothingItem, WearLog, WearStatistics, SkinToneAnalysis, ClothingCategory } from '../../types';
import { INITIAL_CLOTHES_SEED } from './seedData';

const CLOTHES_KEY = 'outfit_web_clothes';
const WEAR_LOGS_KEY = 'outfit_web_wear_logs';
const SKIN_ANALYSIS_KEY = 'outfit_web_skin_analysis';
const GEMINI_KEY_STORAGE = 'outfit_web_gemini_key';
const GEMINI_MODEL_STORAGE = 'outfit_web_gemini_model';

export const WardrobeStorage = {
  // --- CLOTHES CRUD ---
  getClothes(): ClothingItem[] {
    const raw = localStorage.getItem(CLOTHES_KEY);
    if (!raw) {
      return this.resetToSeedData();
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return this.resetToSeedData();
    } catch {
      return this.resetToSeedData();
    }
  },

  saveClothes(clothes: ClothingItem[]): void {
    localStorage.setItem(CLOTHES_KEY, JSON.stringify(clothes));
  },

  addCloth(item: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>): ClothingItem {
    const clothes = this.getClothes();
    const newItem: ClothingItem = {
      ...item,
      id: `cloth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      wearCount: 0,
      createdAt: new Date().toISOString(),
    };
    clothes.unshift(newItem);
    this.saveClothes(clothes);
    return newItem;
  },

  updateCloth(id: string, updates: Partial<ClothingItem>): ClothingItem | null {
    const clothes = this.getClothes();
    const index = clothes.findIndex((c) => c.id === id);
    if (index === -1) return null;

    clothes[index] = { ...clothes[index], ...updates };
    this.saveClothes(clothes);
    return clothes[index];
  },

  deleteCloth(id: string): boolean {
    const clothes = this.getClothes();
    const filtered = clothes.filter((c) => c.id !== id);
    if (filtered.length !== clothes.length) {
      this.saveClothes(filtered);
      // Remove wear logs for this garment
      const logs = this.getWearLogs().filter((l) => l.clothId !== id);
      this.saveWearLogs(logs);
      return true;
    }
    return false;
  },

  // --- WEAR LOGGING ---
  getWearLogs(): WearLog[] {
    const raw = localStorage.getItem(WEAR_LOGS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  },

  saveWearLogs(logs: WearLog[]): void {
    localStorage.setItem(WEAR_LOGS_KEY, JSON.stringify(logs));
  },

  logWear(
    clothId: string,
    details?: { occasion?: string; rating?: number; notes?: string; date?: string }
  ): { item: ClothingItem; log: WearLog } | null {
    const clothes = this.getClothes();
    const itemIndex = clothes.findIndex((c) => c.id === clothId);
    if (itemIndex === -1) return null;

    const item = clothes[itemIndex];
    const wornDate = details?.date || new Date().toISOString().split('T')[0];

    // Increment wear count and update last worn date
    const updatedItem: ClothingItem = {
      ...item,
      wearCount: (item.wearCount || 0) + 1,
      lastWornDate: wornDate,
    };
    clothes[itemIndex] = updatedItem;
    this.saveClothes(clothes);

    // Save wear log
    const newLog: WearLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clothId,
      wornDate,
      occasion: details?.occasion || 'Casual',
      rating: details?.rating ?? 5,
      notes: details?.notes || '',
      createdAt: new Date().toISOString(),
    };

    const logs = this.getWearLogs();
    logs.unshift(newLog);
    this.saveWearLogs(logs);

    return { item: updatedItem, log: newLog };
  },

  // --- STATISTICS ---
  getStatistics(): WearStatistics {
    const clothes = this.getClothes();
    const logs = this.getWearLogs();

    const totalItems = clothes.length;
    const totalWears = clothes.reduce((sum, c) => sum + (c.wearCount || 0), 0);
    const averageWearPerItem = totalItems > 0 ? Number((totalWears / totalItems).toFixed(1)) : 0;
    const totalValue = clothes.reduce((sum, c) => sum + (c.price || 0), 0);
    const averageCostPerWear = totalWears > 0 ? Number((totalValue / totalWears).toFixed(2)) : 0;

    // Neglected items: items worn 0 times OR last worn > 60 days ago
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const neglectedItems = clothes.filter((c) => {
      if (!c.wearCount || c.wearCount === 0) return true;
      if (!c.lastWornDate) return true;
      return new Date(c.lastWornDate) < sixtyDaysAgo;
    });

    const activeItemsCount = totalItems - neglectedItems.length;
    const utilizationRate = totalItems > 0 ? Math.round((activeItemsCount / totalItems) * 100) : 0;

    // Most and least worn
    const sortedByWear = [...clothes].sort((a, b) => b.wearCount - a.wearCount);
    const mostWornItem = sortedByWear.length > 0 ? sortedByWear[0] : null;
    const leastWornItem = sortedByWear.length > 0 ? sortedByWear[sortedByWear.length - 1] : null;

    // Category distribution
    const categories: ClothingCategory[] = ['tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'one_piece'];
    const categoryDistribution = categories.map((cat) => {
      const catItems = clothes.filter((c) => c.category === cat);
      const wearCount = catItems.reduce((acc, curr) => acc + (curr.wearCount || 0), 0);
      return {
        category: cat,
        count: catItems.length,
        wearCount,
      };
    });

    // Recent wear logs enriched with garment data
    const clothesMap = new Map(clothes.map((c) => [c.id, c]));
    const recentWearLogs = logs.slice(0, 15).map((log) => {
      const c = clothesMap.get(log.clothId);
      return {
        ...log,
        clothName: c ? c.name : 'Unknown Garment',
        hexCode: c ? c.hexCode : '#94A3B8',
        category: c ? c.category : ('tops' as ClothingCategory),
      };
    });

    return {
      totalItems,
      totalWears,
      averageWearPerItem,
      totalValue,
      averageCostPerWear,
      utilizationRate,
      mostWornItem,
      leastWornItem,
      neglectedItems,
      categoryDistribution,
      recentWearLogs,
    };
  },

  // --- SKIN ANALYSIS PERSISTENCE ---
  getSkinAnalysis(): SkinToneAnalysis | null {
    const raw = localStorage.getItem(SKIN_ANALYSIS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSkinAnalysis(analysis: SkinToneAnalysis): void {
    localStorage.setItem(SKIN_ANALYSIS_KEY, JSON.stringify(analysis));
  },

  // --- API KEY & MODEL SETTINGS ---
  getApiKey(): string {
    return localStorage.getItem(GEMINI_KEY_STORAGE)?.trim() || '';
  },

  saveApiKey(key: string): void {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  },

  clearApiKey(): void {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  },

  getModel(): string {
    return localStorage.getItem(GEMINI_MODEL_STORAGE) || 'gemini-3.8-flash';
  },

  saveModel(model: string): void {
    localStorage.setItem(GEMINI_MODEL_STORAGE, model);
  },

  // --- RESET & IMPORT/EXPORT ---
  resetToSeedData(): ClothingItem[] {
    const timestamp = new Date().toISOString();
    const seededClothes: ClothingItem[] = INITIAL_CLOTHES_SEED.map((item, idx) => ({
      ...item,
      id: `seed_cloth_${idx + 1}`,
      createdAt: timestamp,
    }));

    this.saveClothes(seededClothes);

    // Also seed realistic wear logs for these items
    const occasions = ['Work', 'Casual Weekend', 'Date Night', 'Business Meeting', 'Dinner Party'];
    const initialLogs: WearLog[] = [];

    seededClothes.forEach((cloth) => {
      if (cloth.wearCount > 0 && cloth.lastWornDate) {
        initialLogs.push({
          id: `seed_log_${cloth.id}`,
          clothId: cloth.id,
          wornDate: cloth.lastWornDate,
          occasion: occasions[Math.floor(Math.random() * occasions.length)],
          rating: 4 + Math.round(Math.random()),
          notes: `Styled with ${cloth.brand || 'capsule essentials'}.`,
          createdAt: timestamp,
        });
      }
    });

    this.saveWearLogs(initialLogs);
    return seededClothes;
  },

  exportData(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      clothes: this.getClothes(),
      wearLogs: this.getWearLogs(),
      skinAnalysis: this.getSkinAnalysis(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.clothes && Array.isArray(parsed.clothes)) {
        this.saveClothes(parsed.clothes);
        if (parsed.wearLogs && Array.isArray(parsed.wearLogs)) {
          this.saveWearLogs(parsed.wearLogs);
        }
        if (parsed.skinAnalysis) {
          this.saveSkinAnalysis(parsed.skinAnalysis);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
