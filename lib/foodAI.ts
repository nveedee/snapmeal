/*
 * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
 * Zweck: Laufzeit-KI-Feature – Foto einer Mahlzeit wird an Google Gemini Flash
 *        gesendet, das Gericht und Nährwerte werden automatisch erkannt.
 * Modell: gemini-2.0-flash (Google AI Studio, kostenloses Free Tier)
 * API-Key: EXPO_PUBLIC_GEMINI_API_KEY in .env.local (nie ins Git-Repository)
 * Quelle: https://ai.google.dev/gemini-api/docs/vision
 * Datenschutz: Fotos werden nur für diese Anfrage übertragen, nicht gespeichert.
 */

export type FoodAnalysis = {
  food_name:       string;
  estimated_grams: number | null;
  calories:        number | null;
  protein_g:       number | null;
  carbs_g:         number | null;
  fat_g:           number | null;
  confidence:      'high' | 'medium' | 'low';
};

const API_KEY  = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';
const TIMEOUT_MS = 20_000;

// KI-generiert – Prompt auf Deutsch für zuverlässige JSON-Ausgabe
const PROMPT =
  'Analysiere dieses Foto einer Mahlzeit. Antworte NUR mit einem JSON-Objekt, kein Markdown:\n' +
  '{"food_name":"Name auf Deutsch","estimated_grams":Zahl,"calories":Zahl,' +
  '"protein_g":Zahl,"carbs_g":Zahl,"fat_g":Zahl,"confidence":"high"|"medium"|"low"}\n' +
  'Falls kein Essen erkennbar: {"error":"no_food"}';

/*
 * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
 * Zweck: Base64-Foto an Gemini Flash senden und Nährwertschätzung zurückgeben.
 * Rückgabe: FoodAnalysis oder null bei Fehler / kein Essen erkannt.
 */
export async function analyzeFoodImage(base64: string): Promise<FoodAnalysis | null> {
  if (!API_KEY) {
    console.warn('analyzeFoodImage: EXPO_PUBLIC_GEMINI_API_KEY fehlt in .env.local');
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
      signal:  controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: base64 } },
            { text: PROMPT },
          ],
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error('analyzeFoodImage: HTTP', response.status, errBody);
      return null;
    }

    const json = await response.json();
    const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('AI text len:', text.length, '| finish:', json.candidates?.[0]?.finishReason);
    console.log('AI text:', text);

    if (!text) {
      console.warn('analyzeFoodImage: leere Antwort', JSON.stringify(json.candidates?.[0]));
      return null;
    }

    // Markdown-Fences entfernen falls Modell sie trotzdem hinzufügt
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.error === 'no_food') return null;

    return {
      food_name:       parsed.food_name       ?? 'Unbekanntes Gericht',
      estimated_grams: parsed.estimated_grams ?? null,
      calories:        parsed.calories        ?? null,
      protein_g:       parsed.protein_g       ?? null,
      carbs_g:         parsed.carbs_g         ?? null,
      fat_g:           parsed.fat_g           ?? null,
      confidence:      parsed.confidence      ?? 'low',
    };
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.warn('analyzeFoodImage: Timeout nach', TIMEOUT_MS, 'ms');
    } else {
      console.error('analyzeFoodImage:', err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}
