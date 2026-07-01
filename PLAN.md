# SnapMeal – Entwicklungsplan
Modul 335 | Stand: 01.07.2026

---

## Aufgabenverteilung

| Person | Verantwortlich für |
|---|---|
| **Noel** | Phase 1 (Fundament) + Phase 3 (Home-Tab, Detail, Einstellungen) + Karten-Skeleton |
| **Elias** | Phase 2 (AI-Anbindung + confirm-entry fertigstellen) |
| **Ron** | Phase 4 (Meal-Marker auf Karte) + Phase 5 (Verlauf/Statistik) |
| **Alle** | Phase 6 (Polish, Fehlerbehandlung, Dokumentation) |

---

## Übersicht

| Phase | Inhalt | Zuständig | Status |
|---|---|---|---|
| 1 | Fundament: Pakete, Navigation, Datenbank | Noel | ✅ fertig |
| 2.1 | Kamera-Screen (new-entry.tsx) | Noel | ✅ fertig |
| 2.2 | AI-Anbindung (lib/foodAI.ts) | Elias | ⬜ offen |
| 2.3 | confirm-entry.tsx – Formular + GPS + insertMeal | Noel/Elias | 🔧 in Arbeit |
| 3 | Home-Tab: Tagesübersicht + Detailscreen + Einstellungen | Noel | ✅ fertig |
| 4.0 | Karten-Skeleton (MapView + Standort + UI) | Noel | ✅ fertig |
| 4.1 | Meal-Marker auf Karte (Marker + Callout) | Ron | ⬜ offen |
| 5 | Verlauf/Statistik-Tab | Ron | ⬜ offen |
| 6 | Polish, Fehlerbehandlung, Dokumentationspflichten | Alle | ⬜ offen |

---

## Was bereits gebaut ist (Code vorhanden)

| Datei | Inhalt |
|---|---|
| `lib/db.ts` | Vollständige SQLite-Schicht (initDB, insertMeal, getMealsToday, getMealById, getAllMeals, getMealsByDay) |
| `lib/maps-stub.ts` | Web-Stub für react-native-maps (Metro-Resolver-Fix) |
| `app/_layout.tsx` | Stack-Navigation mit allen Screens registriert |
| `app/(tabs)/_layout.tsx` | 4 Tabs: Home / Kamera / Karte / Verlauf |
| `app/(tabs)/index.tsx` | Home: FlatList heutiger Mahlzeiten, Fortschrittsbalken, Makro-Chips |
| `app/(tabs)/new-entry.tsx` | Kamera-Screen: CameraView, Foto aufnehmen, Galerie, Permissions |
| `app/(tabs)/map.tsx` | Karte (native): MapView, Standortermittlung, UI-Header |
| `app/(tabs)/map.web.tsx` | Karte (web): Fallback-Screen ohne react-native-maps |
| `app/(tabs)/history.tsx` | Verlauf: Platzhalter mit Mock-Balkendiagramm (Ron befüllt) |
| `app/meal/[id].tsx` | Detailscreen: Foto, Nährwerte, Koordinaten |
| `app/settings.tsx` | Einstellungen: Tagesziel + Name via AsyncStorage |
| `app/confirm-entry.tsx` | Bestätigungsformular: Platzhalter-UI (noch nicht funktional) |
| `app/gallery.tsx` | Fotogalerie: alle Mahlzeiten 3-spaltig |
| `constants/theme.ts` | Palette (Pastelgrün-Farben) |
| `metro.config.js` | wasm-Assets + react-native-maps Web-Resolver |
| `assets/leaflet-map.html` | Leaflet-HTML (archiviert, nicht mehr genutzt) |

---

---

# NOEL – Phase 1: Fundament

> ✅ Vollständig abgeschlossen.

### 1.1 Pakete installieren

```bash
npx expo install expo-camera expo-image-picker expo-location expo-sqlite
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-maps
```

Status: ✅ fertig

---

### 1.2 Navigation auf 4 Tabs umbauen

Status: ✅ fertig

---

### 1.3 Datenbank-Schicht (SQLite)

Datei: `lib/db.ts`

Tabelle `meals`:
```sql
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
```

Status: ✅ fertig

---

# NOEL – Phase 3: Home-Tab, Detail & Einstellungen

> ✅ Vollständig abgeschlossen.

### 3.1 Home-Tab – Tagesübersicht (`app/(tabs)/index.tsx`) — ✅ fertig
### 3.2 Detailscreen (`app/meal/[id].tsx`) — ✅ fertig
### 3.3 Einstellungen-Screen (`app/settings.tsx`) — ✅ fertig

---

# NOEL – Karten-Skeleton (Phase 4.0)

> ✅ Vollständig abgeschlossen. Ron kann direkt aufbauen.

Datei: `app/(tabs)/map.tsx`

Fertig gebaut:
- `MapView` mit `react-native-maps`, Startregion Schweiz
- `expo-location`: Standortermittlung beim Öffnen des Tabs
- `animateToRegion()` auf aktuellen Standort
- `showsUserLocation` Punkt auf Karte
- Grüner Header mit Locate-Button
- Banner bei verweigertem Standortzugriff
- Web-Fallback: `app/(tabs)/map.web.tsx` (Metro-Resolver-Fix in `metro.config.js`)

Status: ✅ fertig

---

---

# ELIAS – Phase 2: AI + Bestätigungsformular

> Phase 2.1 (Kamera-Screen) wurde von Noel gebaut. Elias startet bei 2.2.

### 2.2 AI-Anbindung (Vision API)

Datei: `lib/foodAI.ts` (neu anlegen)

```ts
// KI-Nutzungsdeklaration:
// Dieses Modul sendet das Mahlzeit-Foto an die Claude Vision API (claude-haiku-4-5-20251001).
// Zweck: automatische Erkennung von Gericht und Schätzung der Nährwerte.
// API-Key wird serverseitig im Proxy gehalten und nie im Client-Code exponiert.
// Quelle: https://docs.anthropic.com/en/api/getting-started
```

Funktion: `analyzeFoodImage(base64: string): Promise<FoodAnalysis | null>`

Rückgabeformat:
```json
{
  "food_name": "Spaghetti Bolognese",
  "estimated_grams": 350,
  "calories": 520,
  "protein_g": 22,
  "carbs_g": 65,
  "fat_g": 18,
  "confidence": "medium"
}
```

Fehlerbehandlung:
- Kein Internet / API-Fehler / Timeout (15 s) → `return null` → Formular öffnet leer

**Proxy-Optionen:**
- Option A (empfohlen): Kleines Node/Express-Script oder Vercel Serverless Function hält den API-Key
- Option B (Prototyp): Direktaufruf im Client mit Key in `.env` → muss in Systemdoku deklariert werden

Status: ⬜ offen

---

### 2.3 Bestätigungs-Formular

Datei: `app/confirm-entry.tsx` (Platzhalter vorhanden, muss fertiggestellt werden)

Ablauf:
1. `photoUri` aus Router-Params lesen
2. `ActivityIndicator` anzeigen während `analyzeFoodImage()` läuft
3. Felder mit AI-Ergebnis vorausfüllen (oder leer bei `null`)
4. Nutzer kann alle Werte bearbeiten
5. Beim Speichern: GPS-Standort holen (`expo-location`, Permission prüfen)
6. `insertMeal()` aufrufen → `router.replace('/')`

Pflicht-Formularfelder:
| Feld | keyboardType | Pflicht |
|---|---|---|
| Gericht-Name | `default` | ja |
| Menge (g) | `numeric` | nein |
| Kalorien | `decimal-pad` | ja |
| Protein (g) | `decimal-pad` | nein |
| Kohlenhydrate (g) | `decimal-pad` | nein |
| Fett (g) | `decimal-pad` | nein |

Status: 🔧 in Arbeit

---

---

# RON – Phase 4: Karten-Tab

> Karten-Skeleton (MapView + Standort + UI) wurde von Noel gebaut.
> Ron ergänzt nur noch die Meal-Marker.

### 4.1 Meal-Marker auf Karte

Datei: `app/(tabs)/map.tsx` (an markierter TODO-Stelle einfügen)

Was zu tun ist:
1. `getAllMeals()` aus `lib/db.ts` laden (useFocusEffect)
2. Mahlzeiten mit `latitude != null` filtern
3. Für jede Mahlzeit ein `<Marker>` in den `<MapView>` einfügen
4. `<Callout>` mit Thumbnail, Gericht-Name, Kalorien, Datum
5. Tap auf Callout → `router.push('/meal/' + meal.id)`
6. Wenn keine Mahlzeiten mit GPS: Hinweistext einblenden

```tsx
// Import am Anfang ergänzen:
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getAllMeals, Meal } from '@/lib/db';
import { Callout, Marker } from 'react-native-maps';

// Im MapView:
{meals.filter(m => m.latitude && m.longitude).map(m => (
  <Marker key={m.id} coordinate={{ latitude: m.latitude!, longitude: m.longitude! }}>
    <Callout onPress={() => router.push(`/meal/${m.id}`)}>
      {/* Thumbnail + Name + Kalorien + Datum */}
    </Callout>
  </Marker>
))}
```

**Bekannte Einschränkung (in Doku vermerken):** Auf Android in Expo Go kann Google Maps eingeschränkt sein (kein eigener API-Key in der Expo-Go-Binary). Fallback: iOS-Gerät oder EAS Development Build.

Status: ⬜ offen

---

---

# RON – Phase 5: Verlauf/Statistik-Tab

> `getMealsByDay()` in `lib/db.ts` ist bereit.

### 5.1 Wochenübersicht & Verlaufsliste

Datei: `app/(tabs)/history.tsx` (Mock-Platzhalter vorhanden, mit echten Daten ersetzen)

Elemente:
- **Balkendiagramm:** Kalorien pro Tag der letzten 7 Tage
  - Bibliothek: `react-native-gifted-charts` (empfohlen) oder eigene SVG-Balken
- **Liste vergangener Tage** darunter (Datum + Gesamt-Kalorien)
- Tap auf Tag → zeigt alle Mahlzeiten dieses Tages (z. B. als expandierende Liste)

Daten: `getMealsByDay()` liefert `{ day, total_calories, meals[] }[]`

Status: ⬜ offen

---

---

# ALLE – Phase 6: Polish & Pflichten

### 6.1 Fehler- und Sonderfälle (gemeinsam prüfen)

| Szenario | Verhalten | Zuständig |
|---|---|---|
| Kein Internet beim Fotografieren | Formular öffnet leer, manuelle Eingabe | Elias |
| Location-Permission verweigert | Eintrag ohne Koordinaten, kein Karten-Pin | Elias |
| Kamera-Permission verweigert | Hinweistext + Einstellungen-Button | ✅ Noel (gebaut) |
| Leere Mahlzeitenliste (Home) | Leerzustand-Text anzeigen | ✅ Noel (gebaut) |
| Keine Mahlzeiten mit GPS (Karte) | Hinweistext auf der Karte | Ron |

Status: ⬜ offen

---

### 6.2 Formularpflichten (Checkliste – Elias)

- [ ] Gericht-Name: `keyboardType="default"`
- [ ] Menge (g): `keyboardType="numeric"`
- [ ] Kalorien: `keyboardType="decimal-pad"`
- [ ] Tagesziel (Einstellungen): `keyboardType="numeric"` ✅ Noel (gebaut)

Status: ⬜ offen

---

### 6.3 Dokumentationspflichten (alle zusammen)

- [ ] **Noel:** Android/Expo-Go Karteneinschränkung als bekannte Limitierung in Systemdoku
- [ ] **Elias:** API-Key-Handling dokumentieren (Proxy oder bewusste Vereinfachung)
- [ ] **Elias:** KI-Nutzungsdeklaration als Codekommentar in `lib/foodAI.ts`
- [ ] **Elias:** Vision-API als Laufzeit-KI-Feature in Systemdoku deklarieren
- [ ] **Alle:** Gegenseitiger Code-Review vor Abgabe

Status: ⬜ offen

---

## Offene Entscheidungen (Team)

| # | Frage | Optionen |
|---|---|---|
| 1 | AI-API direkt im Client oder via Proxy? | A: Node/Express-Proxy (empfohlen) · B: Direktaufruf mit Doku-Deklaration |
| 2 | Welche Vision-API? | A: Claude API (`claude-haiku-4-5-20251001`) · B: LogMeal API |
| 3 | Balkendiagramm-Bibliothek? | A: `react-native-gifted-charts` · B: eigene SVG-Balken |
| 4 | Android-Karten-Fallback nötig? | Testen in Expo Go, ggf. EAS Dev Build |

---

## Abhängigkeiten (wer wartet auf wen)

```
✅ Noel (Phase 1 + 3 + Karten-Skeleton)
    ├──► Elias: Phase 2.2 + 2.3 (AI + confirm-entry)
    └──► Ron: Phase 4.1 (Marker) + Phase 5 (Verlauf)

Alle fertig ──► Phase 6 gemeinsam
```
