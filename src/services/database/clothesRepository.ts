import { getDatabase } from './db';
import {
  ClothingCategory,
  ClothingItem,
  WearLog,
  WearStatistics,
  SkinToneAnalysis,
} from './types';

interface RawClothRow {
  id: string;
  name: string;
  category: string;
  color_name: string;
  hex_code: string;
  season: string;
  brand: string | null;
  image_uri: string | null;
  wear_count: number;
  last_worn_date: string | null;
  price: number | null;
  notes: string | null;
  created_at: string;
}

function mapRowToCloth(row: RawClothRow): ClothingItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ClothingCategory,
    colorName: row.color_name,
    hexCode: row.hex_code,
    season: row.season as ClothingItem['season'],
    brand: row.brand ?? undefined,
    imageUri: row.image_uri ?? undefined,
    wearCount: row.wear_count,
    lastWornDate: row.last_worn_date ?? undefined,
    price: row.price ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getAllClothes(options?: {
  category?: ClothingCategory | 'all';
  searchQuery?: string;
  sortBy?: 'wear_desc' | 'wear_asc' | 'recent' | 'name';
}): Promise<ClothingItem[]> {
  const db = await getDatabase();
  let query = 'SELECT * FROM clothes WHERE 1=1';
  const params: (string | number)[] = [];

  if (options?.category && options.category !== 'all') {
    query += ' AND category = ?';
    params.push(options.category);
  }

  if (options?.searchQuery && options.searchQuery.trim().length > 0) {
    query += ' AND (name LIKE ? OR color_name LIKE ? OR brand LIKE ?)';
    const term = `%${options.searchQuery.trim()}%`;
    params.push(term, term, term);
  }

  switch (options?.sortBy) {
    case 'wear_desc':
      query += ' ORDER BY wear_count DESC, created_at DESC';
      break;
    case 'wear_asc':
      query += ' ORDER BY wear_count ASC, created_at DESC';
      break;
    case 'name':
      query += ' ORDER BY name ASC';
      break;
    case 'recent':
    default:
      query += ' ORDER BY last_worn_date DESC NULLS LAST, created_at DESC';
      break;
  }

  const rows = await db.getAllAsync<RawClothRow>(query, params);
  return rows.map(mapRowToCloth);
}

export async function getClothById(id: string): Promise<ClothingItem | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<RawClothRow>(
    'SELECT * FROM clothes WHERE id = ?;',
    [id]
  );
  return row ? mapRowToCloth(row) : null;
}

export async function addCloth(
  cloth: Omit<ClothingItem, 'id' | 'createdAt' | 'wearCount'>
): Promise<ClothingItem> {
  const db = await getDatabase();
  const id = `cloth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO clothes (
      id, name, category, color_name, hex_code, season, brand,
      image_uri, wear_count, last_worn_date, price, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      cloth.name,
      cloth.category,
      cloth.colorName,
      cloth.hexCode,
      cloth.season,
      cloth.brand ?? null,
      cloth.imageUri ?? null,
      0,
      cloth.lastWornDate ?? null,
      cloth.price ?? 0,
      cloth.notes ?? null,
      now,
    ]
  );

  return {
    ...cloth,
    id,
    wearCount: 0,
    createdAt: now,
  };
}

export async function updateCloth(
  cloth: ClothingItem
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE clothes SET
      name = ?, category = ?, color_name = ?, hex_code = ?, season = ?,
      brand = ?, image_uri = ?, price = ?, notes = ?
     WHERE id = ?`,
    [
      cloth.name,
      cloth.category,
      cloth.colorName,
      cloth.hexCode,
      cloth.season,
      cloth.brand ?? null,
      cloth.imageUri ?? null,
      cloth.price ?? 0,
      cloth.notes ?? null,
      cloth.id,
    ]
  );
}

export async function deleteCloth(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM clothes WHERE id = ?;', [id]);
}

/**
 * Log a wear event: increments wear_count, updates last_worn_date, and records entry in wear_logs
 */
export async function logWear(
  clothId: string,
  details?: {
    wornDate?: string;
    occasion?: string;
    rating?: number;
    notes?: string;
  }
): Promise<void> {
  const db = await getDatabase();
  const wornDate = details?.wornDate || new Date().toISOString().split('T')[0];
  const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    // 1. Insert into wear_logs
    await db.runAsync(
      `INSERT INTO wear_logs (id, cloth_id, worn_date, occasion, rating, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        clothId,
        wornDate,
        details?.occasion ?? 'Daily rotation',
        details?.rating ?? 5,
        details?.notes ?? null,
        now,
      ]
    );

    // 2. Increment wear count and set last_worn_date in clothes
    await db.runAsync(
      `UPDATE clothes SET
        wear_count = wear_count + 1,
        last_worn_date = ?
       WHERE id = ?`,
      [wornDate, clothId]
    );
  });
}

export async function getWearLogs(clothId?: string): Promise<WearLog[]> {
  const db = await getDatabase();
  let query = 'SELECT * FROM wear_logs';
  const params: string[] = [];

  if (clothId) {
    query += ' WHERE cloth_id = ?';
    params.push(clothId);
  }

  query += ' ORDER BY worn_date DESC, created_at DESC LIMIT 50';
  const rows = await db.getAllAsync<{
    id: string;
    cloth_id: string;
    worn_date: string;
    occasion: string | null;
    rating: number | null;
    notes: string | null;
    created_at: string;
  }>(query, params);

  return rows.map((r) => ({
    id: r.id,
    clothId: r.cloth_id,
    wornDate: r.worn_date,
    occasion: r.occasion ?? undefined,
    rating: r.rating ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function getWearStatistics(): Promise<WearStatistics> {
  const db = await getDatabase();

  const allItems = await getAllClothes();
  const totalItems = allItems.length;

  const totalWears = allItems.reduce((acc, cur) => acc + cur.wearCount, 0);
  const averageWearPerItem = totalItems > 0 ? Number((totalWears / totalItems).toFixed(1)) : 0;

  const sortedByWears = [...allItems].sort((a, b) => b.wearCount - a.wearCount);
  const mostWornItem = sortedByWears.length > 0 ? sortedByWears[0] : null;
  const leastWornItem = sortedByWears.length > 0 ? sortedByWears[sortedByWears.length - 1] : null;

  // Neglected items: items worn 0 times or not worn in > 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  const neglectedItemsCount = allItems.filter(
    (item) => item.wearCount === 0 || (!item.lastWornDate || item.lastWornDate < thirtyDaysAgoStr)
  ).length;

  // Category distribution
  const categories: ClothingCategory[] = ['tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'one_piece'];
  const categoryDistribution = categories.map((cat) => {
    const matching = allItems.filter((i) => i.category === cat);
    return {
      category: cat,
      count: matching.length,
      wearCount: matching.reduce((sum, item) => sum + item.wearCount, 0),
    };
  });

  // Recent wear logs with item metadata
  const rawLogs = await db.getAllAsync<{
    id: string;
    cloth_id: string;
    worn_date: string;
    occasion: string | null;
    rating: number | null;
    notes: string | null;
    created_at: string;
    cloth_name: string;
    hex_code: string;
    category: string;
  }>(`
    SELECT w.*, c.name as cloth_name, c.hex_code, c.category
    FROM wear_logs w
    INNER JOIN clothes c ON w.cloth_id = c.id
    ORDER BY w.worn_date DESC, w.created_at DESC
    LIMIT 20;
  `);

  const recentWearLogs = rawLogs.map((l) => ({
    id: l.id,
    clothId: l.cloth_id,
    wornDate: l.worn_date,
    occasion: l.occasion ?? undefined,
    rating: l.rating ?? undefined,
    notes: l.notes ?? undefined,
    createdAt: l.created_at,
    clothName: l.cloth_name,
    hexCode: l.hex_code,
    category: l.category as ClothingCategory,
  }));

  return {
    totalItems,
    totalWears,
    averageWearPerItem,
    mostWornItem,
    leastWornItem,
    neglectedItemsCount,
    categoryDistribution,
    recentWearLogs,
  };
}

// Skin Tone Analysis Storage
export async function saveSkinToneAnalysis(analysis: Omit<SkinToneAnalysis, 'id'>): Promise<SkinToneAnalysis> {
  const db = await getDatabase();
  const id = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  await db.runAsync(
    `INSERT INTO skin_tone_analyses (
      id, analyzed_at, skin_tone, undertone, contrast_level,
      palette_name, palette_description, recommended_colors,
      avoid_colors, wardrobe_advice, image_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      analysis.analyzedAt,
      analysis.skinTone,
      analysis.undertone,
      analysis.contrastLevel,
      analysis.paletteName,
      analysis.paletteDescription,
      JSON.stringify(analysis.recommendedColors),
      JSON.stringify(analysis.avoidColors),
      analysis.wardrobeAdvice,
      analysis.imageUri ?? null,
    ]
  );

  return {
    ...analysis,
    id,
  };
}

export async function getLatestSkinToneAnalysis(): Promise<SkinToneAnalysis | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    analyzed_at: string;
    skin_tone: string;
    undertone: string;
    contrast_level: string;
    palette_name: string;
    palette_description: string | null;
    recommended_colors: string;
    avoid_colors: string;
    wardrobe_advice: string | null;
    image_uri: string | null;
  }>('SELECT * FROM skin_tone_analyses ORDER BY analyzed_at DESC LIMIT 1;');

  if (!row) return null;

  try {
    return {
      id: row.id,
      analyzedAt: row.analyzed_at,
      skinTone: row.skin_tone,
      undertone: row.undertone as SkinToneAnalysis['undertone'],
      contrastLevel: row.contrast_level as SkinToneAnalysis['contrastLevel'],
      paletteName: row.palette_name,
      paletteDescription: row.palette_description ?? '',
      recommendedColors: JSON.parse(row.recommended_colors),
      avoidColors: JSON.parse(row.avoid_colors),
      wardrobeAdvice: row.wardrobe_advice ?? '',
      imageUri: row.image_uri ?? undefined,
    };
  } catch (e) {
    console.error('Failed to parse saved skin tone analysis:', e);
    return null;
  }
}
