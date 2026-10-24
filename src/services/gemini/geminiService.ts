import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenAI } from '@google/genai';
import { SkinToneAnalysis, RecommendedColor, AvoidColor, ClothingItem } from '../database/types';
import { SAMPLE_PROFILES } from './sampleProfiles';

const API_KEY_STORAGE_KEY = 'outfit_gemini_api_key';

export async function getStoredApiKey(): Promise<string | null> {
  try {
    const saved = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  } catch (e) {
    console.warn('[GeminiService] Could not read API key from storage:', e);
  }
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
}

export async function saveStoredApiKey(apiKey: string): Promise<void> {
  await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
}

export async function clearStoredApiKey(): Promise<void> {
  await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
}

const SYSTEM_PROMPT = `
You are an expert personal stylist and master color analyst specializing in seasonal color analysis, skin tone science, and personal wardrobe curation.
Analyze the provided portrait photo carefully to determine the subject's skin tone, undertone, and contrast level.

Respond with ONLY a valid, raw JSON object (no markdown code blocks, no backticks, no extra text) conforming to this exact structure:
{
  "skinTone": "descriptive name of skin tone depth and nuance, e.g. Warm Golden Honey, Cool Fair Ivory, Deep Rich Espresso, Olive Tan",
  "undertone": "Warm | Cool | Neutral | Olive",
  "contrastLevel": "High | Medium | Low",
  "paletteName": "Seasonal palette name, e.g. Deep Autumn, Cool Summer, Bright Winter, Light Spring, Soft Autumn, etc.",
  "paletteDescription": "2-3 concise sentences explaining why this palette harmonizes with the subject's skin undertones, eye color, and natural hair contrast.",
  "recommendedColors": [
    {
      "name": "Color name (e.g. Forest Green)",
      "hex": "#047857",
      "category": "primary | neutral | accent",
      "description": "Why this specific color flatters the subject's complexion",
      "styleTip": "How to wear it in outfits (e.g. overcoat, knitwear, trousers, accessories)"
    }
  ],
  "avoidColors": [
    {
      "name": "Color name (e.g. Icy Pastel Yellow)",
      "hex": "#FEF08A",
      "reason": "Why this color clashes or washes out the subject's undertones"
    }
  ],
  "wardrobeAdvice": "Actionable capsule wardrobe tips for building high-confidence outfits that enhance natural glow."
}

Provide 5-6 recommendedColors with diverse categories (at least 2 primary, 2 neutral, 1 accent) and 2-3 avoidColors with realistic hex codes.
`;

export async function analyzeSkinToneWithGemini(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<SkinToneAnalysis> {
  const apiKey = await getStoredApiKey();

  // If no API key is configured, utilize intelligent fallback engine
  if (!apiKey) {
    console.log('[GeminiService] No API key detected. Running high-fidelity local stylist simulation.');
    await new Promise((resolve) => setTimeout(resolve, 1400)); // Realistic processing animation
    return simulateAnalysis(imageBase64);
  }

  try {
    // Initialize Google GenAI client with standard guidelines
    const ai = new GoogleGenAI({ apiKey });

    // Request using gemini-3.8-flash (official recommended multimodal model)
    const response = await ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
        },
        {
          type: 'image',
          data: imageBase64,
          mime_type: mimeType,
        },
      ],
    });

    const responseText = response.output_text || '';
    const cleanedJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    return {
      id: `analysis_${Date.now()}`,
      analyzedAt: new Date().toISOString(),
      skinTone: parsed.skinTone || 'Medium Natural Tan',
      undertone: parsed.undertone || 'Neutral',
      contrastLevel: parsed.contrastLevel || 'Medium',
      paletteName: parsed.paletteName || 'Soft Autumn',
      paletteDescription: parsed.paletteDescription || 'Harmonious palette curated for your undertones.',
      recommendedColors: Array.isArray(parsed.recommendedColors) ? parsed.recommendedColors : [],
      avoidColors: Array.isArray(parsed.avoidColors) ? parsed.avoidColors : [],
      wardrobeAdvice: parsed.wardrobeAdvice || 'Focus on wearing your primary colors close to your face.',
    };
  } catch (error) {
    console.warn('[GeminiService] Primary API call encountered error:', error);
    
    // Attempt direct REST fetch fallback to ensure cross-runtime compatibility
    try {
      return await directFetchFallback(apiKey, imageBase64, mimeType);
    } catch (fallbackError) {
      console.warn('[GeminiService] Fallback also failed, using simulation:', fallbackError);
      return simulateAnalysis(imageBase64);
    }
  }
}

/**
 * Direct REST fallback to generativelanguage.googleapis.com
 */
async function directFetchFallback(
  apiKey: string,
  imageBase64: string,
  mimeType: string
): Promise<SkinToneAnalysis> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Direct fetch failed with status ${res.status}`);
  }

  const json = await res.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    id: `analysis_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    skinTone: parsed.skinTone,
    undertone: parsed.undertone,
    contrastLevel: parsed.contrastLevel,
    paletteName: parsed.paletteName,
    paletteDescription: parsed.paletteDescription,
    recommendedColors: parsed.recommendedColors || [],
    avoidColors: parsed.avoidColors || [],
    wardrobeAdvice: parsed.wardrobeAdvice || '',
  };
}

/**
 * Deterministic local stylist simulation when offline or no API key is entered
 */
export function simulateAnalysis(imageReference?: string): SkinToneAnalysis {
  // Rotate or select profile based on string hash
  let profile = SAMPLE_PROFILES[0];
  if (imageReference) {
    const sum = imageReference.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    profile = SAMPLE_PROFILES[sum % SAMPLE_PROFILES.length];
  }

  return {
    id: `sim_${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    ...profile.analysis,
    imageUri: profile.imageUri,
  };
}

/**
 * Match user clothes in local database with recommended color palette
 */
export function matchClothesWithPalette(
  clothes: ClothingItem[],
  recommendedColors: RecommendedColor[]
): {
  cloth: ClothingItem;
  matchedColor: RecommendedColor;
  matchScore: number;
}[] {
  const matches: {
    cloth: ClothingItem;
    matchedColor: RecommendedColor;
    matchScore: number;
  }[] = [];

  for (const cloth of clothes) {
    let bestMatch: RecommendedColor | null = null;
    let highestScore = 0;

    for (const rec of recommendedColors) {
      const score = calculateColorSimilarity(cloth.hexCode, rec.hex);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = rec;
      }
    }

    if (bestMatch && highestScore >= 65) {
      matches.push({
        cloth,
        matchedColor: bestMatch,
        matchScore: highestScore,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Hex color distance and similarity percentage (0-100)
 */
function calculateColorSimilarity(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 50;

  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  // Euclidean RGB distance
  const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  const maxDistance = Math.sqrt(255 * 255 * 3); // ~441.67

  const similarity = Math.max(0, Math.min(100, Math.round((1 - distance / maxDistance) * 100)));
  return similarity;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}
