# Systemdokumentation – SnapMeal

**Projekt:** SnapMeal – Visuelles Kalorie-Tagebuch  
**Modul:** 335 – Mobile-Applikationen realisieren  
**Autor:** Noel von Däniken  
**Datum:** 02.07.2026  
**Version:** 1.0.0  

---

## 1. Projektbeschreibung

SnapMeal ist eine mobile Applikation für iOS und Android, die es Nutzern ermöglicht, ihre tägliche Kalorienaufnahme einfach und visuell zu verfolgen. Der Hauptunterschied zu klassischen Kalorienzähl-Apps liegt im Erfassungsweg: Anstatt Gerichte manuell zu suchen, fotografiert der Nutzer seine Mahlzeit. Eine KI-Schnittstelle (Google Gemini Flash) analysiert das Foto und schätzt automatisch Kalorien und Nährwerte. Alternativ kann ein Barcode gescannt werden, um Produktdaten von Open Food Facts abzurufen.

Alle Daten werden lokal auf dem Gerät gespeichert – es gibt kein Backend und keine Cloud-Synchronisation.

### 1.1 Projektziele

- Mahlzeiten per Foto oder Barcode-Scan erfassen
- KI-gestützte automatische Nährwertschätzung
- GPS-Standort bei jeder Mahlzeit speichern
- Tagesübersicht mit Kalorienziel und Makronährstoffen
- Verlauf der letzten 7 Tage
- Interaktive Karte mit Mahlzeit-Markierungen

### 1.2 Abgrenzung

- Keine Benutzerkonten oder Cloud-Synchronisation
- Kein Backend-Server
- KI-Schätzungen sind Näherungswerte, keine exakten Messwerte
- Die App funktioniert im Browser nur eingeschränkt (keine Kamera, kein GPS, keine SQLite)

---

## 2. Systemarchitektur

### 2.1 Überblick

Die App ist als **Single-Device-Applikation** konzipiert. Alle Daten bleiben auf dem Gerät. Externe Dienste werden nur für die KI-Analyse (Gemini) und Barcode-Lookups (Open Food Facts) verwendet.

```
Nutzer
  │
  ├── Foto aufnehmen / Barcode scannen
  │         │
  │    [externe APIs]
  │    ├── Google Gemini Flash  →  Nährwertschätzung aus Foto
  │    └── Open Food Facts      →  Produktdaten aus Barcode
  │         │
  │    Bestätigungs-Formular (Werte anpassen)
  │         │
  │    expo-sqlite (lokal)
  │         │
  ├── Home-Screen (Tagesübersicht)
  ├── Verlauf (7 Tage)
  └── Karte (GPS-Pins)
```

### 2.2 Tech-Stack

| Bereich | Technologie | Version |
|---|---|---|
| Framework | Expo / React Native | SDK 54.0 / RN 0.81.5 |
| Routing | expo-router (file-based) | ~6.0.23 |
| Sprache | TypeScript | ~5.9.2 |
| Datenbank | expo-sqlite (lokal) | ~16.0.10 |
| KI-Analyse | Google Gemini 2.5 Flash REST | v1beta |
| Produktdaten | Open Food Facts REST API | öffentlich |
| Karte | react-native-maps | 1.20.1 |
| Kamera | expo-camera (CameraView) | ~17.0.10 |
| Standort | expo-location | ~19.0.8 |
| Einstellungen | @react-native-async-storage | 2.2.0 |
| Icons | @expo/vector-icons (Ionicons) | ^15.0.3 |
| SVG | react-native-svg | 15.12.1 |

### 2.3 Projektstruktur

```
snapmeal/
├── app/                     Screens (expo-router file-based routing)
│   ├── _layout.tsx          Root-Stack-Navigator, DB-Initialisierung
│   ├── (tabs)/
│   │   ├── index.tsx        Home – Tagesübersicht
│   │   ├── new-entry.tsx    Kamera-Screen
│   │   ├── map.tsx          Karte (nativ)
│   │   ├── map.web.tsx      Karten-Fallback (Web)
│   │   └── history.tsx      Verlauf 7 Tage
│   ├── confirm-entry.tsx    Nährwert-Formular
│   ├── barcode-scan.tsx     Barcode-Scanner
│   ├── meal/[id].tsx        Mahlzeit-Detail + Löschen
│   ├── gallery.tsx          Foto-Galerie
│   └── settings.tsx         Einstellungen
├── lib/                     Business-Logik
│   ├── db.ts                SQLite CRUD-Funktionen
│   ├── foodAI.ts            Gemini Flash API-Anbindung
│   ├── openFoodFacts.ts     Open Food Facts API
│   ├── photoStore.ts        Base64-Zwischenspeicher
│   └── maps-stub.ts         Web-Stub für react-native-maps
├── components/
│   └── SnapMealLogo.tsx     App-Logo (SVG-Komponente)
├── constants/
│   └── theme.ts             Design-System (Farben, Abstände, Typografie)
├── assets/images/           Icons, Splash-Screen
├── metro.config.js          Bundler-Konfiguration
└── app.json                 Expo-Konfiguration
```

---

## 3. Datenbankdesign

Die App verwendet **SQLite** über `expo-sqlite`. Die Datenbank wird lokal auf dem Gerät gespeichert und ist nur für die App zugänglich.

### 3.1 Tabelle: `meals`

| Spalte | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | INTEGER PK | ja | Automatisch vergeben |
| `photo_uri` | TEXT | nein | Lokaler Dateipfad zum Foto |
| `food_name` | TEXT | ja | Name der Mahlzeit |
| `grams` | REAL | nein | Menge (Zahl) |
| `unit` | TEXT | nein | `'g'` oder `'ml'`, Standard: `'g'` |
| `calories` | REAL | nein | Kalorien in kcal |
| `protein_g` | REAL | nein | Protein in Gramm |
| `carbs_g` | REAL | nein | Kohlenhydrate in Gramm |
| `fat_g` | REAL | nein | Fett in Gramm |
| `latitude` | REAL | nein | GPS-Breitengrad |
| `longitude` | REAL | nein | GPS-Längengrad |
| `timestamp` | TEXT | ja | ISO-8601 Zeitstempel (`2026-07-02T14:30:00.000Z`) |

### 3.2 Initialisierung und Migration

Die Datenbank wird beim App-Start in `app/_layout.tsx` initialisiert (`initDB()`). Falls die Tabelle bereits existiert, wird sie nicht neu erstellt. Neue Spalten werden per `ALTER TABLE` migriert – schlägt die Migration fehl (Spalte existiert bereits), wird der Fehler ignoriert.

### 3.3 Einstellungen (AsyncStorage)

Nutzereinstellungen werden separat in `@react-native-async-storage` gespeichert:

| Schlüssel | Typ | Beschreibung |
|---|---|---|
| `dailyGoal` | string (Zahl) | Tägliches Kalorienziel (Standard: 2000) |
| `userName` | string | Anzeigename des Nutzers |

---

## 4. Externe Schnittstellen

### 4.1 Google Gemini Flash API

**Zweck:** Foto einer Mahlzeit analysieren und Nährwerte schätzen.

| Eigenschaft | Wert |
|---|---|
| Endpoint | `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` |
| Authentifizierung | `x-goog-api-key` Header |
| Key-Speicherort | `.env.local` → `EXPO_PUBLIC_GEMINI_API_KEY` |
| Timeout | 20 Sekunden |
| Eingabe | Base64-kodiertes JPEG + Textprompt auf Deutsch |
| Ausgabe | JSON mit `food_name`, `estimated_grams`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `confidence` |

**Fehlerbehandlung:** Bei Fehler (Timeout, HTTP-Fehler, ungültiges JSON) gibt die Funktion `null` zurück. Die Felder bleiben im Formular leer und können manuell ausgefüllt werden.

### 4.2 Open Food Facts API

**Zweck:** EAN/UPC-Barcode nachschlagen und Produktnährwerte abrufen.

| Eigenschaft | Wert |
|---|---|
| Endpoint | `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json` |
| Authentifizierung | Kein API-Key (Open Data, ODbL-Lizenz) |
| Timeout | 15 Sekunden |
| Ausgabe | Produktname, Kalorien/100g, Protein, Kohlenhydrate, Fett, Portionsgrösse |

Nährwerte werden pro 100g geliefert. Die App berechnet die tatsächlichen Werte basierend auf der eingegebenen Menge automatisch neu.

---

## 5. Navigation

Die App verwendet `expo-router` mit dateibasiertem Routing (ähnlich wie Next.js).

```
Stack (Root)
├── (tabs)                   Tab-Navigation (Bottom Bar)
│   ├── /           Home
│   ├── /new-entry  Kamera
│   ├── /map        Karte
│   └── /history    Verlauf
├── /confirm-entry           Nährwert-Formular (nach Foto/Scan)
├── /barcode-scan            Barcode-Scanner (Vollbild)
├── /meal/[id]               Mahlzeit-Detailansicht (dynamische Route)
├── /gallery                 Foto-Galerie
└── /settings                Einstellungen
```

---

## 6. Design-System

Das Design-System ist in `constants/theme.ts` definiert und wird in allen Screens verwendet.

**Primärfarbe:** Pastellgrün `#7DC995` – vermittelt Frische und Gesundheit.  
**Akzentfarbe:** Amber `#FBBF24` – für Warnungen und Highlights.  
**Hintergrund:** `#F2F9F4` (grüntöniges Weiss).

Alle Abstände folgen einem **8-Punkt-Raster** (4, 8, 12, 16, 24, 32 px).  
Eckenradien: 6px (Chips) bis 9999px (Pille-Buttons).

---

## 7. Besonderheiten / Technische Entscheide

### 7.1 Plattform-Split für die Karte
`react-native-maps` funktioniert nicht im Web-Browser. Metro löst `map.web.tsx` vs `map.tsx` automatisch nach Plattform auf. Zusätzlich leitet `metro.config.js` den Import von `react-native-maps` im Web-Bundle auf einen leeren Stub um, damit der Bundle-Prozess nicht fehlschlägt.

### 7.2 Base64-Foto im RAM
Expo Router übergibt Parameter als URL-Strings. Ein Base64-kodiertes Foto (mehrere MB) ist zu gross für URL-Parameter. Daher wird das Base64 in einem globalen In-Memory-Speicher (`lib/photoStore.ts`) zwischengespeichert und nach dem Speichern wieder geleert.

### 7.3 Kamera-Konflikt auf iOS
iOS erlaubt nur eine aktive Kamera-Session gleichzeitig. Da der Kamera-Tab (`new-entry.tsx`) und der Barcode-Scanner (`barcode-scan.tsx`) beide `CameraView` nutzen, wurde folgendes umgesetzt:
- `new-entry.tsx`: CameraView wird nur gerendert wenn der Tab fokussiert ist (`useIsFocused`)
- `barcode-scan.tsx`: CameraView startet mit 200ms Verzögerung (`useFocusEffect` + `setTimeout`), damit iOS die erste Session freigeben kann

### 7.4 Nährwerte pro 100g
Open Food Facts liefert alle Nährwerte pro 100g. Die App speichert diese Basiswerte intern und rechnet bei jeder Gramm-Eingabe automatisch die tatsächlichen Werte um. Das Mengen-Feld unterstützt sowohl Gramm (feste Speisen) als auch Milliliter (Getränke).

---

## 8. Installation und Konfiguration

### 8.1 Voraussetzungen
- Node.js ≥ 18
- Expo Go App auf dem Testgerät (iOS oder Android)
- Google-Account mit Zugriff auf Google AI Studio

### 8.2 Setup

```bash
git clone <repo-url>
cd snapmeal
npm install
```

`.env.local` im Projekt-Root erstellen:
```
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...
```

App starten:
```bash
npx expo start --clear
```

QR-Code mit Expo Go scannen.

### 8.3 API-Key erstellen
1. [aistudio.google.com](https://aistudio.google.com) öffnen
2. "Get API key" → "Create API key"
3. Key kopieren (beginnt mit `AIzaSy`)
4. In `.env.local` eintragen

> **Wichtig:** `.env.local` ist im `.gitignore` eingetragen und wird nie ins Repository committet.
