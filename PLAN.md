# SnapMeal – Entwicklungsplan
Modul 335 | Stand: 01.07.2026

---

## Aufgabenverteilung

| Person | Verantwortlich für |
|---|---|
| **Noel** | Phase 1 (Fundament) + Phase 3 (Home-Tab, Detail, Einstellungen) |
| **Elias** | Phase 2 (Kamera + AI + Bestätigungsformular) |
| **Ron** | Phase 4 (Karten-Tab) + Phase 5 (Verlauf/Statistik) |
| **Alle** | Phase 6 (Polish, Fehlerbehandlung, Dokumentation) |

> **Wichtig:** Phase 1 muss als erstes abgeschlossen sein, bevor Elias und Ron mit ihrer Arbeit beginnen können (Pakete und DB-Schicht werden überall gebraucht).

---

## Übersicht

| Phase | Inhalt | Zuständig | Status |
|---|---|---|---|
| 1 | Fundament: Pakete, Navigation, Datenbank | Noel | ⬜ offen |
| 2 | Kernfeature: Kamera + AI + Bestätigungsformular | Elias | ⬜ offen |
| 3 | Home-Tab: Tagesübersicht + Detailscreen + Einstellungen | Noel | ⬜ offen |
| 4 | Karten-Tab | Ron | ⬜ offen |
| 5 | Verlauf/Statistik-Tab | Ron | ⬜ offen |
| 6 | Polish, Fehlerbehandlung, Dokumentationspflichten | Alle | ⬜ offen |

---

---

# NOEL – Phase 1: Fundament

> Muss zuerst fertig sein. Elias und Ron können erst danach starten.

### 1.1 Pakete installieren

```bash
npx expo install expo-camera expo-image-picker expo-location expo-sqlite
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-maps
```

Status: ⬜ offen

---

### 1.2 Navigation auf 4 Tabs umbauen

Datei: `app/(tabs)/_layout.tsx`

Tabs (in dieser Reihenfolge):
- **index** → Home (Icon: `house.fill`)
- **new-entry** → Neuer Eintrag / Kamera (Icon: `camera.fill`)
- **map** → Karte (Icon: `map.fill`)
- **history** → Verlauf (Icon: `chart.bar.fill`)

Datei: `app/_layout.tsx`
- Stack-Screen `meal/[id]` für Detailansicht hinzufügen
- Stack-Screen `settings` für Einstellungen hinzufügen
- Stack-Screen `confirm-entry` für Bestätigungsformular hinzufügen

Neue Platzhalter-Dateien anlegen:
- `app/(tabs)/new-entry.tsx`
- `app/(tabs)/map.tsx`
- `app/(tabs)/history.tsx`
- `app/meal/[id].tsx`
- `app/settings.tsx`
- `app/confirm-entry.tsx`

Status: ⬜ offen

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

Zu implementierende Funktionen:
- `initDB()` – Tabelle anlegen, beim App-Start aufrufen
- `insertMeal(meal)` – neuen Eintrag speichern
- `getMealsToday()` – Einträge von heute (für Home-Tab)
- `getMealById(id)` – Einzeleintrag (für Detailscreen)
- `getAllMeals()` – alle Einträge (für Karte und Verlauf)
- `getMealsByDay()` – gruppiert nach Tag (für Statistik)

`initDB()` in `app/_layout.tsx` beim App-Start aufrufen.

Status: ⬜ offen

---

# NOEL – Phase 3: Home-Tab, Detail & Einstellungen

> Kann parallel zu Elias (Phase 2) und Ron (Phase 4/5) entwickelt werden, sobald Phase 1 fertig ist.

### 3.1 Home-Tab – Tagesübersicht

Datei: `app/(tabs)/index.tsx`

Elemente:
- Header mit aktuellem Datum
- Fortschrittsbalken: `(heutige Kalorien / Tagesziel) * 100 %`
- Summe heutige Kalorien + Tagesziel (aus AsyncStorage, Key: `dailyGoal`)
- `FlatList` der heutigen Mahlzeiten:
  - Mini-Foto (50×50 px, runde Ecken)
  - Gericht-Name
  - Kalorien
  - Uhrzeit
- Tap auf Eintrag → `router.push('/meal/' + id)`
- Einstellungen-Icon in der Header-Ecke → `router.push('/settings')`
- Leerer Zustand: Text „Noch keine Mahlzeiten heute – Foto machen!"

Status: ⬜ offen

---

### 3.2 Detailscreen

Datei: `app/meal/[id].tsx`

Elemente:
- Großes Foto (Vollbreite)
- Gericht-Name, Datum + Uhrzeit
- Nährwert-Kacheln: Kalorien · Protein · Carbs · Fett
- Standort-Info (Koordinaten oder „kein Standort" falls nicht vorhanden)

Daten laden mit `getMealById(id)` aus `lib/db.ts`.

Status: ⬜ offen

---

### 3.3 Einstellungen-Screen

Datei: `app/settings.tsx`

Felder:
- **Tagesziel Kalorien** (`keyboardType="numeric"`) → lesen/schreiben via AsyncStorage, Key `dailyGoal`
- Name/Profil (optional, falls Zeit reicht)
- Speichern-Button → zurück zu Home

Status: ⬜ offen

---

---

# ELIAS – Phase 2: Kamera + AI + Bestätigungsformular

> Startet nach Phase 1. Ist das komplexeste Feature – früh anfangen!

### 2.1 Kamera-Screen

Datei: `app/(tabs)/new-entry.tsx`

Ablauf:
1. Beim Öffnen: Kamera-Permission abfragen (`expo-image-picker`)
2. Zwei Buttons: **Foto aufnehmen** / **aus Galerie wählen**
3. Bei Verweigerung: Hinweistext + Button „Einstellungen öffnen" (`Linking.openSettings()`)
4. Nach Fotoauswahl:
   - Foto-URI + Base64 zwischenspeichern
   - Weiter zu `confirm-entry` via `router.push('/confirm-entry')`

Status: ⬜ offen

---

### 2.2 AI-Anbindung (Vision API)

Datei: `lib/foodAI.ts`

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

Datei: `app/confirm-entry.tsx`

Ablauf:
1. `ActivityIndicator` anzeigen während `analyzeFoodImage()` läuft
2. Felder mit AI-Ergebnis vorausfüllen (oder leer bei `null`)
3. Nutzer kann alle Werte bearbeiten
4. GPS-Standort holen beim Speichern (`expo-location`, Permission prüfen)
5. `insertMeal()` aufrufen → `router.replace('/')`

Pflicht-Formularfelder:
| Feld | keyboardType | Pflicht |
|---|---|---|
| Gericht-Name | `default` | ja |
| Menge (g) | `numeric` | nein |
| Kalorien | `decimal-pad` | ja |
| Protein (g) | `decimal-pad` | nein |
| Kohlenhydrate (g) | `decimal-pad` | nein |
| Fett (g) | `decimal-pad` | nein |

Status: ⬜ offen

---

---

# RON – Phase 4: Karten-Tab

> Startet nach Phase 1. Braucht `getAllMeals()` aus `lib/db.ts`.

### 4.1 Karte mit Meal-Pins

Datei: `app/(tabs)/map.tsx`

Elemente:
- `MapView` (`react-native-maps`), Startregion auf letzten Eintrag mit Koordinaten
- Alle Mahlzeiten mit `latitude/longitude != null` als `<Marker>`
- Tap auf Marker → `<Callout>` mit:
  - Foto-Thumbnail (60×60)
  - Gericht-Name
  - Kalorien
  - Datum

Fehlerfall: Keine Einträge mit Koordinaten → Hinweistext auf der Karte.

**Bekannte Einschränkung (in Doku vermerken):** Auf Android in Expo Go kann Google Maps eingeschränkt sein (kein eigener API-Key in der Expo-Go-Binary). Fallback: iOS-Gerät oder EAS Development Build.

Status: ⬜ offen

---

---

# RON – Phase 5: Verlauf/Statistik-Tab

> Kann parallel zur Karte (Phase 4) entwickelt werden. Braucht `getMealsByDay()` aus `lib/db.ts`.

### 5.1 Wochenübersicht & Verlaufsliste

Datei: `app/(tabs)/history.tsx`

Elemente:
- **Balkendiagramm:** Kalorien pro Tag der letzten 7 Tage
  - Bibliothek: `react-native-gifted-charts` (empfohlen) oder eigene SVG-Balken
- **Liste vergangener Tage** darunter (Datum + Gesamt-Kalorien)
- Tap auf Tag → zeigt alle Mahlzeiten dieses Tages (z. B. als expandierende Liste)

Status: ⬜ offen

---

---

# ALLE – Phase 6: Polish & Pflichten

### 6.1 Fehler- und Sonderfälle (gemeinsam prüfen)

| Szenario | Verhalten | Zuständig |
|---|---|---|
| Kein Internet beim Fotografieren | Formular öffnet leer, manuelle Eingabe | Elias |
| Location-Permission verweigert | Eintrag ohne Koordinaten, kein Karten-Pin | Elias |
| Kamera-Permission verweigert | Hinweistext + Einstellungen-Button | Elias |
| Leere Mahlzeitenliste (Home) | Leerzustand-Text anzeigen | Noel |
| Keine Mahlzeiten mit GPS (Karte) | Hinweistext auf der Karte | Ron |

Status: ⬜ offen

---

### 6.2 Formularpflichten (Checkliste – Elias)

- [ ] Gericht-Name: `keyboardType="default"`
- [ ] Menge (g): `keyboardType="numeric"`
- [ ] Kalorien: `keyboardType="decimal-pad"`
- [ ] Tagesziel (Einstellungen): `keyboardType="numeric"`

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
Noel (Phase 1)
    ├──► Elias kann starten (Phase 2)
    ├──► Ron kann starten (Phase 4 + 5)
    └──► Noel selbst macht weiter (Phase 3)

Alle fertig ──► Phase 6 gemeinsam
```
