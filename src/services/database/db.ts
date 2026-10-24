import * as SQLite from 'expo-sqlite';
import { INITIAL_CLOTHES_SEED } from './seedData';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const db = await SQLite.openDatabaseAsync('outfit.db');
    dbInstance = db;
    await initDatabase(db);
    return db;
  } catch (error) {
    console.warn('[SQLite] Failed to open native database, using fallback/memory mode:', error);
    throw error;
  }
}

export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  // Enable WAL mode for high performance
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS clothes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      color_name TEXT NOT NULL,
      hex_code TEXT NOT NULL,
      season TEXT NOT NULL,
      brand TEXT,
      image_uri TEXT,
      wear_count INTEGER NOT NULL DEFAULT 0,
      last_worn_date TEXT,
      price REAL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_clothes_category ON clothes(category);
    CREATE INDEX IF NOT EXISTS idx_clothes_wear_count ON clothes(wear_count);

    CREATE TABLE IF NOT EXISTS wear_logs (
      id TEXT PRIMARY KEY NOT NULL,
      cloth_id TEXT NOT NULL,
      worn_date TEXT NOT NULL,
      occasion TEXT,
      rating INTEGER DEFAULT 5,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (cloth_id) REFERENCES clothes(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_wear_logs_cloth ON wear_logs(cloth_id);
    CREATE INDEX IF NOT EXISTS idx_wear_logs_date ON wear_logs(worn_date);

    CREATE TABLE IF NOT EXISTS skin_tone_analyses (
      id TEXT PRIMARY KEY NOT NULL,
      analyzed_at TEXT NOT NULL,
      skin_tone TEXT NOT NULL,
      undertone TEXT NOT NULL,
      contrast_level TEXT NOT NULL,
      palette_name TEXT NOT NULL,
      palette_description TEXT,
      recommended_colors TEXT NOT NULL,
      avoid_colors TEXT NOT NULL,
      wardrobe_advice TEXT,
      image_uri TEXT
    );
  `);

  // Check if seeding is needed
  const countRow = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM clothes;'
  );

  if (!countRow || countRow.count === 0) {
    await seedInitialWardrobe(db);
  }
}

export async function seedInitialWardrobe(db: SQLite.SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();
  
  for (let i = 0; i < INITIAL_CLOTHES_SEED.length; i++) {
    const item = INITIAL_CLOTHES_SEED[i];
    const id = `item_${Date.now()}_${i}`;

    await db.runAsync(
      `INSERT INTO clothes (
        id, name, category, color_name, hex_code, season, brand,
        image_uri, wear_count, last_worn_date, price, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        item.name,
        item.category,
        item.colorName,
        item.hexCode,
        item.season,
        item.brand ?? null,
        item.imageUri ?? null,
        item.wearCount,
        item.lastWornDate ?? null,
        item.price ?? 0,
        item.notes ?? null,
        now,
      ]
    );

    // Add a couple of initial wear logs for the seeded items
    if (item.lastWornDate) {
      await db.runAsync(
        `INSERT INTO wear_logs (id, cloth_id, worn_date, occasion, rating, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          `log_${Date.now()}_${i}`,
          id,
          item.lastWornDate,
          'Daily rotation',
          5,
          'Comfortable fit',
          now,
        ]
      );
    }
  }
}

export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DROP TABLE IF EXISTS wear_logs;
    DROP TABLE IF EXISTS clothes;
    DROP TABLE IF EXISTS skin_tone_analyses;
  `);
  await initDatabase(db);
}
