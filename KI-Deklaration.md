# KI-Deklaration – SnapMeal

**Projekt:** SnapMeal – Visuelles Kalorie-Tagebuch  
**Modul:** 335 – Mobile-Applikationen realisieren  
**Autor:** Noel von Däniken  
**Datum:** 02.07.2026  
**Verwendetes KI-Tool:** Claude Code (Claude Sonnet 4.6, Anthropic)  

---

## 1. Grundsatz

Im Rahmen dieses Projekts wurde das KI-Tool **Claude Code (Anthropic)** für spezifische technische Problemstellungen eingesetzt, die über den Stoff des Moduls hinausgehen. Die gesamte App-Logik, das Datenbankdesign, alle Screens und die Navigation wurden eigenständig erarbeitet. Die KI wurde ausschliesslich für die folgenden drei Bereiche verwendet.

---

## 2. KI-unterstützte Bereiche

### 2.1 `lib/foodAI.ts` – Gemini Flash API-Anbindung
**Was die KI gemacht hat:** Implementierung der Funktion `analyzeFoodImage()`, die ein Base64-Foto an die Google Gemini Flash REST API sendet und eine Nährwert-Schätzung zurückbekommt. Dazu gehören der korrekte Request-Aufbau mit multimodalem Input (Bild + Text), der Prompt auf Deutsch sowie die Fehlerbehandlung mit AbortController-Timeout.

**Begründung:** Die Gemini REST API mit multimodalem Input ist in der offiziellen Dokumentation komplex beschrieben. Zusätzlich traten mehrere API-Fehler auf (404, 429, 401, 503), deren Ursachen (falscher Modellname, falscher Key-Typ, Kontingent-Limit) ohne Erfahrung mit dieser API schwer zu diagnostizieren waren.

---

### 2.2 `lib/openFoodFacts.ts` – Open Food Facts API
**Was die KI gemacht hat:** TypeScript-Typen für die API-Antwortstruktur (`OffNutriments`, `OffProduct`) und das Mapping der ungewöhnlichen Feldnamen (`energy-kcal_100g`, `proteins_100g`) auf die internen Typen der App.

**Begründung:** Die API verwendet nicht-standardmässige Feldnamen mit Sonderzeichen, die als TypeScript-Interface-Keys escaped werden müssen.

---

### 2.3 Web-Bundle-Fix (`metro.config.js` + `lib/maps-stub.ts`)
**Was die KI gemacht hat:** Konfiguration von `metro.config.js` mit einem `resolveRequest`-Hook, der `react-native-maps` im Web-Bundle auf eine leere Stub-Datei umleitet, damit der Bundler nicht fehlschlägt.

**Begründung:** Das Problem (native-only Module brechen den Web-Bundle) und die Lösung über den Metro-Resolver sind nicht in der regulären Expo-Dokumentation beschrieben. Es handelt sich um ein fortgeschrittenes Bundler-Thema.

---

## 3. Eigenständig erarbeitete Teile

Alle übrigen Teile der App wurden ohne KI-Unterstützung erstellt:

- Gesamte App-Architektur und Technologiewahl
- Datenbankschema und alle CRUD-Funktionen (`lib/db.ts`)
- Alle vier Tab-Screens (Home, Kamera, Karte, Verlauf)
- Barcode-Scanner-Screen und Navigation
- Bestätigungs-Formular inkl. GPS-Integration
- Mahlzeit-Detailansicht und Löschen-Funktion
- Einstellungen-Screen
- Design-System und alle StyleSheets
- Sämtliche Dokumentationen

---

## 4. Lernnachweis

Die KI-generierten Codeteile wurden vollständig gelesen, verstanden und teilweise angepasst. Dabei habe ich folgendes gelernt:

- Aufbau von REST API-Requests mit multimodalem Input in React Native
- Umgang mit verschiedenen HTTP-Fehlercodes und deren Ursachen
- Funktionsweise des Metro-Bundlers bei plattformspezifischen Modulen
