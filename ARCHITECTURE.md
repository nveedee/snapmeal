# SnapMeal – Projektarchitektur

> KI-generiert (Claude Code / Claude Sonnet 4.6, 02.07.2026)  
> Modul 335 – Mobile-App Entwicklung | Team: Noel, Elias, Ron

---

## Überblick

SnapMeal ist eine **React Native / Expo**-App (SDK 54) zum visuellen Erfassen von Mahlzeiten. Der Nutzer fotografiert sein Essen (oder scannt einen Barcode), eine KI schätzt die Kalorien, und der Eintrag wird mit GPS-Koordinaten lokal gespeichert.

```
Foto / Barcode
      │
      ▼
  KI-Analyse (Gemini) / Open Food Facts API
      │
      ▼
  Bestätigungs-Formular (Nährwerte anpassen)
      │
      ▼
  SQLite-Datenbank (lokal auf dem Gerät)
      │
      ▼
  Home / Verlauf / Karte
```

---

## Tech-Stack

| Schicht | Technologie | Version |
|---|---|---|
| Framework | Expo / React Native | SDK 54.0 / RN 0.81 |
| Routing | expo-router (file-based) | ~6.0 |
| Datenbank | expo-sqlite (lokal) | ~16.0 |
| KI-Analyse | Google Gemini 2.5 Flash REST API | v1beta |
| Produktdaten | Open Food Facts REST API | kostenlos, kein Key |
| Karte | react-native-maps | 1.20 |
| Kamera | expo-camera (CameraView) | ~17.0 |
| Standort | expo-location | ~19.0 |
| Persistenz (Settings) | @react-native-async-storage | 2.2 |
| Icons | @expo/vector-icons (Ionicons) | ^15 |
| SVG | react-native-svg | 15.12 |
| Sprache | TypeScript | ~5.9 |

---

## Ordnerstruktur

```
snapmeal/
│
├── app/                        ← Alle Screens (expo-router, file-based routing)
│   ├── _layout.tsx             ← Root-Layout: Stack-Navigator + DB-Init
│   ├── (tabs)/                 ← Tab-Navigation (4 Tabs)
│   │   ├── _layout.tsx         ← Tab-Bar-Konfiguration (Icons, Labels)
│   │   ├── index.tsx           ← Tab 1: Home – Tagesübersicht + Kalorien
│   │   ├── new-entry.tsx       ← Tab 2: Kamera-Screen (Foto aufnehmen)
│   │   ├── history.tsx         ← Tab 3: Verlauf (letzte 7 Tage)
│   │   ├── map.tsx             ← Tab 4: Karte mit Mahlzeit-Markierungen (iOS/Android)
│   │   └── map.web.tsx         ← Tab 4: Web-Fallback (react-native-maps läuft nicht im Browser)
│   ├── confirm-entry.tsx       ← Formular: Nährwerte bestätigen / anpassen + GPS
│   ├── barcode-scan.tsx        ← Barcode-Scanner-Screen (EAN-13/8, UPC-A)
│   ├── meal/[id].tsx           ← Mahlzeit-Detailansicht + Löschen-Funktion
│   ├── gallery.tsx             ← Foto-Galerie aller Mahlzeiten
│   └── settings.tsx            ← Einstellungen (Tageskalorienziel, Name)
│
├── lib/                        ← Business-Logik / Datenzugriff
│   ├── db.ts                   ← SQLite-Datenbank: Schema, CRUD-Funktionen
│   ├── foodAI.ts               ← Gemini Flash API: Foto → Nährwert-Schätzung
│   ├── openFoodFacts.ts        ← Open Food Facts API: Barcode → Produktdaten
│   ├── photoStore.ts           ← In-Memory-Zwischenspeicher für Base64-Fotos
│   └── maps-stub.ts            ← Web-Stub für react-native-maps (verhindert Bundle-Fehler)
│
├── components/                 ← Wiederverwendbare UI-Komponenten
│   └── SnapMealLogo.tsx        ← App-Logo als SVG-Komponente (react-native-svg)
│
├── constants/
│   └── theme.ts                ← Design-System: Farben, Abstände, Radii, Schatten, Typografie
│
├── assets/
│   └── images/                 ← App-Icon, Splash-Screen, Android Adaptive Icon
│
├── hooks/                      ← Custom Hooks
│   ├── use-color-scheme.ts     ← Dark/Light Mode Detection
│   └── use-theme-color.ts      ← Theme-Farben je nach Modus
│
├── metro.config.js             ← Metro-Bundler: react-native-maps → Web-Stub umleiten
├── app.json                    ← Expo-Konfiguration (Icon, Permissions, Plugins)
└── .env.local                  ← Geheime Keys (nie ins Git-Repository!)
```

---

## Datenfluss: Foto-Eintrag erstellen

```
new-entry.tsx  (Kamera-Tab)
    │  Foto aufnehmen (expo-camera)
    │  Base64 → photoStore.set()         ← In-Memory, da zu gross für URL-Parameter
    │  router.push('/confirm-entry', { photoUri })
    ▼
confirm-entry.tsx
    │  photoStore.get() → analyzeFoodImage()   ← Gemini Flash API
    │  API antwortet: { food_name, calories, protein_g, ... }
    │  Felder automatisch befüllt (editierbar)
    │  Gramm-Eingabe → Nährwerte neu berechnen (per-100g Basis)
    │  "Speichern" gedrückt:
    │    → expo-location: GPS-Koordinaten holen
    │    → insertMeal() → SQLite
    │    → router.replace('/')
    ▼
index.tsx / map.tsx / history.tsx
    │  useFocusEffect → getMealsToday() / getAllMeals()
    └  Anzeige aktualisiert
```

---

## Datenfluss: Barcode-Scan

```
new-entry.tsx
    │  "Barcode scannen" Button
    │  router.push('/barcode-scan')
    ▼
barcode-scan.tsx
    │  CameraView mit onBarcodeScanned (EAN-13/8, UPC-A)
    │  Code erkannt → router.replace('/confirm-entry', { barcode })
    ▼
confirm-entry.tsx
    │  fetchProductByBarcode(barcode) → Open Food Facts API
    │  Produktname, Kalorien/100g, Protein/Carbs/Fett befüllen
    │  Mengen-Toggle: g / ml (für Getränke)
    └  weiter wie oben (GPS + Speichern)
```

---

## Datenbank-Schema (SQLite)

Tabelle: `meals`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `photo_uri` | TEXT | Lokaler Dateipfad zum Foto |
| `food_name` | TEXT NOT NULL | Name des Gerichts |
| `grams` | REAL | Menge (in g oder ml) |
| `unit` | TEXT | `'g'` oder `'ml'` |
| `calories` | REAL | Kalorien (kcal) |
| `protein_g` | REAL | Protein (g) |
| `carbs_g` | REAL | Kohlenhydrate (g) |
| `fat_g` | REAL | Fett (g) |
| `latitude` | REAL | GPS-Breitengrad |
| `longitude` | REAL | GPS-Längengrad |
| `timestamp` | TEXT | ISO-8601 Zeitstempel |

**Persistenz:** Vollständig lokal auf dem Gerät. Kein Backend, kein Cloud-Sync.  
**Settings:** `dailyGoal` (Kalorien-Tagesziel) und `userName` via AsyncStorage.

---

## Externe APIs

### Google Gemini Flash (`lib/foodAI.ts`)
- **Zweck:** Foto einer Mahlzeit → automatische Nährwert-Schätzung
- **Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Auth:** `x-goog-api-key` Header (Key in `.env.local` als `EXPO_PUBLIC_GEMINI_API_KEY`)
- **Input:** Base64-kodiertes JPEG + Deutsch-Prompt
- **Output:** JSON `{ food_name, estimated_grams, calories, protein_g, carbs_g, fat_g, confidence }`
- **Timeout:** 20 Sekunden (AbortController)
- **Fehlerfall:** `null` → Felder bleiben leer, manuell ausfüllen

### Open Food Facts (`lib/openFoodFacts.ts`)
- **Zweck:** Barcode → Produktname + Nährwerte pro 100g
- **Endpoint:** `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- **Auth:** Kein API-Key nötig (Open Source)
- **Output:** `{ food_name, calories, protein_g, carbs_g, fat_g, serving_size_g }`
- **Timeout:** 15 Sekunden

---

## Navigation (expo-router)

```
Stack (Root)
├── (tabs)                  ← Bottom Tab Bar
│   ├── /           (index)       Home
│   ├── /new-entry             Kamera
│   ├── /history               Verlauf
│   └── /map                   Karte
│
├── /confirm-entry         ← Modal über Tabs (kein Header-Tab)
├── /barcode-scan          ← Vollbild, kein Header
├── /meal/[id]             ← Dynamische Route: Detailansicht
├── /gallery               ← Foto-Galerie
└── /settings              ← Einstellungen
```

**Besonderheit Web:** `map.web.tsx` überschreibt `map.tsx` automatisch via Metro-Plattform-Auflösung. Zusätzlich leitet `metro.config.js` `react-native-maps` auf `lib/maps-stub.ts` um, damit der Web-Bundle nicht bricht.

---

## Bekannte Einschränkungen

| Thema | Einschränkung |
|---|---|
| KI-Genauigkeit | Gemini schätzt — Werte sind Näherungen, keine Messwerte |
| Offline | Open Food Facts und Gemini brauchen Internet |
| iOS Kamera | Nur eine `CameraView` kann gleichzeitig aktiv sein → `useIsFocused` + Delay-Fix |
| Web | Karte, Kamera, SQLite und GPS funktionieren nicht im Browser |
| Foto-Grösse | Base64 wird nur im RAM gehalten (`photoStore`), nicht persistiert |
| API-Key | `EXPO_PUBLIC_`-Prefix macht den Key client-seitig sichtbar (Expo Go Einschränkung) |
