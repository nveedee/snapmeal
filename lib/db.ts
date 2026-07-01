import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export type Meal = {
  id: number;
  photo_uri: string | null;
  food_name: string;
  grams: number | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
};

export type NewMeal = Omit<Meal, 'id'>;

let _db: SQLite.SQLiteDatabase | null = null;

async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('snapmeal.db');
  }
  return _db;
}

export async function initDB(): Promise<void> {
  if (Platform.OS === 'web') return;
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meals (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      photo_uri TEXT,
      food_name TEXT NOT NULL,
      grams     REAL,
      calories  REAL,
      protein_g REAL,
      carbs_g   REAL,
      fat_g     REAL,
      latitude  REAL,
      longitude REAL,
      timestamp TEXT NOT NULL
    );
  `);
}

export async function insertMeal(meal: NewMeal): Promise<number> {
  if (Platform.OS === 'web') return -1;
  const db = await getDB();
  const result = await db.runAsync(
    `INSERT INTO meals (photo_uri, food_name, grams, calories, protein_g, carbs_g, fat_g, latitude, longitude, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    meal.photo_uri,
    meal.food_name,
    meal.grams,
    meal.calories,
    meal.protein_g,
    meal.carbs_g,
    meal.fat_g,
    meal.latitude,
    meal.longitude,
    meal.timestamp,
  );
  return result.lastInsertRowId;
}

export async function getMealsToday(): Promise<Meal[]> {
  if (Platform.OS === 'web') return [];
  const db = await getDB();
  const today = new Date().toISOString().slice(0, 10);
  return db.getAllAsync<Meal>(
    `SELECT * FROM meals WHERE timestamp LIKE ? ORDER BY timestamp DESC`,
    `${today}%`,
  );
}

export async function getMealById(id: number): Promise<Meal | null> {
  if (Platform.OS === 'web') return null;
  const db = await getDB();
  return db.getFirstAsync<Meal>(`SELECT * FROM meals WHERE id = ?`, id);
}

export async function getAllMeals(): Promise<Meal[]> {
  if (Platform.OS === 'web') return [];
  const db = await getDB();
  return db.getAllAsync<Meal>(`SELECT * FROM meals ORDER BY timestamp DESC`);
}

export async function getMealsByDay(): Promise<{ day: string; total_calories: number; meals: Meal[] }[]> {
  if (Platform.OS === 'web') return [];
  const db = await getDB();
  const meals = await db.getAllAsync<Meal>(`SELECT * FROM meals ORDER BY timestamp DESC`);

  const grouped: Record<string, { day: string; total_calories: number; meals: Meal[] }> = {};
  for (const meal of meals) {
    const day = meal.timestamp.slice(0, 10);
    if (!grouped[day]) {
      grouped[day] = { day, total_calories: 0, meals: [] };
    }
    grouped[day].total_calories += meal.calories ?? 0;
    grouped[day].meals.push(meal);
  }

  return Object.values(grouped).sort((a, b) => b.day.localeCompare(a.day));
}
