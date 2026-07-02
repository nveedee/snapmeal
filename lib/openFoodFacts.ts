/*
 * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
 * Zweck: Open Food Facts API-Anbindung – Nährwertdaten anhand EAN/UPC-Barcode.
 *        Kein API-Key erforderlich (Open Data, ODbL-Lizenz).
 * Quelle API-Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
 */

export type OffNutriments = {
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  [key: string]: number | undefined;
};

export type OffProduct = {
  product_name?: string;
  nutriments?: OffNutriments;
  serving_quantity?: number;
};

export type OffApiResponse = {
  status: number;        // 1 = gefunden, 0 = nicht gefunden
  status_verbose: string;
  product?: OffProduct;
};

// App-interner Rückgabetyp
export type ProductData = {
  food_name: string;
  calories: number | null;       // kcal pro 100 g
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  serving_size_g: number | null; // Portionsgrösse aus API (falls vorhanden)
};

const TIMEOUT_MS = 15_000;

export async function fetchProductByBarcode(barcode: string): Promise<ProductData | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url =
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json` +
      `?fields=product_name,nutriments,serving_quantity`;

    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) return null;

    const json: OffApiResponse = await response.json();

    if (json.status !== 1 || !json.product) return null;

    const { product } = json;
    const n = product.nutriments ?? {};

    return {
      food_name:      product.product_name?.trim() || 'Unbekanntes Produkt',
      calories:       n['energy-kcal_100g'] ?? null,
      protein_g:      n.proteins_100g       ?? null,
      carbs_g:        n.carbohydrates_100g  ?? null,
      fat_g:          n.fat_100g            ?? null,
      serving_size_g: product.serving_quantity ?? null,
    };
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('fetchProductByBarcode: Timeout nach', TIMEOUT_MS, 'ms');
    } else {
      console.error('fetchProductByBarcode:', error);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}
