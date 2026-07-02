# Testdokumentation – SnapMeal

**Projekt:** SnapMeal – Visuelles Kalorie-Tagebuch  
**Modul:** 335 – Mobile-Applikationen realisieren  
**Autor:** Noel von Däniken  
**Datum:** 02.07.2026  
**Testgerät:** iPhone (iOS, Expo Go)  

---

## 1. Testumgebung

| Eigenschaft | Wert |
|---|---|
| Gerät | iPhone |
| Betriebssystem | iOS |
| App-Laufzeitumgebung | Expo Go |
| Expo SDK | 54.0.2 |
| Netzwerk | WLAN (für API-Calls) |
| Testdaten | Eigene Fotos, Evian-Wasserflasche (EAN: 3274080005003) |

---

## 2. Testfälle

### 2.1 Datenbankinitialisierung

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T01 | App erstmals starten | SQLite-Datenbank wird erstellt, kein Fehler | Datenbank erstellt, App lädt normal | ✅ |
| T02 | App erneut starten (DB existiert bereits) | DB wird nicht doppelt erstellt, Daten bleiben erhalten | Daten von vorherigem Start noch vorhanden | ✅ |
| T03 | App nach Update starten (neue `unit`-Spalte) | Migration läuft durch, keine Fehlermeldung | `unit`-Spalte erfolgreich hinzugefügt | ✅ |

---

### 2.2 Kamera und Fotoaufnahme

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T04 | Kamera-Tab öffnen (Berechtigung noch nicht erteilt) | Berechtigungs-Dialog erscheint | Dialog erscheint korrekt | ✅ |
| T05 | Kamera-Berechtigung erteilen | Kamera-Vorschau wird angezeigt | Kamera-Feed sichtbar | ✅ |
| T06 | Foto aufnehmen | Foto wird gespeichert, Weiterleitung zu Bestätigungs-Screen | Weiterleitung erfolgt mit Foto-Vorschau | ✅ |
| T07 | Foto aus Galerie auswählen | Galerie öffnet sich, ausgewähltes Foto erscheint im Bestätigungs-Screen | Funktioniert korrekt | ✅ |
| T08 | Flash ein-/ausschalten | Flash-Status wechselt (off → on → auto → off) | Wechsel funktioniert | ✅ |
| T09 | Kamera wechseln (vorne/hinten) | Kamera wechselt | Wechsel funktioniert | ✅ |
| T10 | Zum Barcode-Scanner wechseln und zurück | Kamera im Kamera-Tab zeigt kein schwarzes Bild | Kamera funktioniert nach Rückkehr | ✅ |

---

### 2.3 Barcode-Scanner

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T11 | Barcode-Scanner öffnen | Kamera startet nach kurzer Verzögerung (kein schwarzer Screen) | Kamera startet korrekt nach ~200ms | ✅ |
| T12 | EAN-13 Barcode scannen (Evian 1.5L) | Barcode wird erkannt, Weiterleitung zu Bestätigungs-Screen | Barcode erkannt, weiterleitet | ✅ |
| T13 | Produktdaten werden geladen | Name und Nährwerte (pro 100g) werden automatisch eingetragen | Evian: 0 kcal, 0g Protein/Carbs/Fett korrekt | ✅ |
| T14 | Unbekannter Barcode scannen | Warnung „Produkt nicht gefunden" erscheint | Gelber Warn-Badge sichtbar | ✅ |
| T15 | Barcode-Scanner ohne WLAN | Timeout nach 15s, Warn-Badge erscheint | Timeout tritt auf, kein App-Absturz | ✅ |

---

### 2.4 KI-Analyse (Gemini Flash)

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T16 | Foto einer Mahlzeit aufnehmen (Spaghetti) | KI analysiert Foto, Felder werden automatisch ausgefüllt | „Spaghetti Bolognese", ca. 400g, 580 kcal erkannt | ✅ |
| T17 | Foto ohne Essen aufnehmen (z.B. Wand) | Felder bleiben leer, kein Fehler | Felder leer, kein Absturz | ✅ |
| T18 | KI-Analyse ohne WLAN | Timeout nach 20s, Felder bleiben leer | Timeout-Warnung in Konsole, kein Absturz | ✅ |
| T19 | API-Server überlastet (503) | Fehlermeldung in Konsole, Formular trotzdem bedienbar | 503-Fehler in Konsole, App bleibt stabil | ✅ |

---

### 2.5 Bestätigungs-Formular

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T20 | Formular ohne Pflichtfeld speichern | Fehlerdialog „Pflichtfeld" erscheint | Alert erscheint korrekt | ✅ |
| T21 | Gramm-Wert ändern (Barcode-Produkt) | Kalorien/Protein/Carbs/Fett werden automatisch neu berechnet | Neuberechnung funktioniert korrekt | ✅ |
| T22 | Einheit auf „ml" wechseln | Toggle wechselt auf ml, Platzhalter zeigt 250 | Wechsel funktioniert | ✅ |
| T23 | Eintrag speichern | GPS wird abgefragt, Eintrag gespeichert, Weiterleitung zu Home | GPS-Koordinaten gespeichert, Home zeigt neuen Eintrag | ✅ |
| T24 | Eintrag ohne GPS-Berechtigung speichern | Eintrag wird ohne Koordinaten gespeichert, kein Fehler | Eintrag ohne GPS gespeichert | ✅ |

---

### 2.6 Home-Screen

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T25 | Home öffnen ohne Mahlzeiten | Leerer Zustand mit „Jetzt fotografieren"-Button | Leerer Zustand angezeigt | ✅ |
| T26 | Home nach Mahlzeit-Erfassung | Neue Mahlzeit erscheint in der Liste | Mahlzeit sichtbar, Kalorien aktualisiert | ✅ |
| T27 | Fortschrittsbalken bei 100% Tagesziel | Balken ist voll | Balken korrekt gefüllt | ✅ |
| T28 | Auf Mahlzeit in der Liste tippen | Weiterleitung zu Detailansicht | Detailansicht öffnet sich | ✅ |
| T29 | Tab wechseln und zurück | Daten werden neu geladen | Aktualisierte Daten sichtbar | ✅ |

---

### 2.7 Mahlzeit-Detailansicht und Löschen

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T30 | Detailansicht öffnen | Alle Nährwerte, Zeitstempel und Standort sichtbar | Alle Daten korrekt dargestellt | ✅ |
| T31 | Mahlzeit mit GPS-Koordinaten | Koordinaten werden angezeigt | Koordinaten korrekt formatiert | ✅ |
| T32 | Mahlzeit ohne GPS | „Kein Standort" angezeigt | Korrekte Anzeige | ✅ |
| T33 | „Eintrag löschen" tippen | Bestätigungs-Dialog erscheint | Dialog erscheint korrekt | ✅ |
| T34 | Löschen bestätigen | Eintrag gelöscht, Weiterleitung zu Home | Eintrag nicht mehr sichtbar | ✅ |
| T35 | Löschen abbrechen | Eintrag bleibt erhalten | Kein Datenverlust | ✅ |

---

### 2.8 Verlauf

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T36 | Verlauf-Tab öffnen | Letzte 7 Tage werden angezeigt (auch ohne Mahlzeiten) | 7-Tage-Übersicht sichtbar | ✅ |
| T37 | Tag mit Mahlzeiten | Kaloriensumme und Mahlzeit-Anzahl korrekt | Werte stimmen mit Datenbankinhalt überein | ✅ |
| T38 | Heutiger Tag | Grüner Balken und Hervorhebung | Heute-Markierung korrekt | ✅ |

---

### 2.9 Karte

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T39 | Karten-Tab öffnen | Karte wird geladen, Mahlzeit-Pins sichtbar | Pins für Mahlzeiten mit GPS erscheinen | ✅ |
| T40 | Auf Pin tippen | Callout mit Name, Kalorien und Datum | Callout erscheint korrekt | ✅ |
| T41 | Auf Callout tippen | Weiterleitung zur Detailansicht | Detailansicht öffnet sich | ✅ |
| T42 | Mahlzeiten ohne GPS | Keine Pins für diese Mahlzeiten, Info-Banner sichtbar | Banner „X Mahlzeiten ohne Standort" korrekt | ✅ |

---

### 2.10 Einstellungen

| # | Beschreibung | Erwartetes Ergebnis | Tatsächliches Ergebnis | Status |
|---|---|---|---|---|
| T43 | Tageskalorienziel ändern | Neuer Wert gespeichert, Home-Fortschrittsbalken aktualisiert | Wert persistent nach App-Neustart | ✅ |
| T44 | Name eingeben | Name auf Home-Screen sichtbar | Name wird korrekt angezeigt | ✅ |

---

## 3. Fehlerfälle und Grenzwerte

| # | Szenario | Verhalten | Bewertung |
|---|---|---|---|
| F01 | Kein Internet beim Start | App startet normal, nur KI und Barcode-Lookup schlagen fehl | Akzeptabel |
| F02 | Gemini API Key fehlt (`.env.local` nicht erstellt) | Warnung in Konsole, Felder bleiben leer | Akzeptabel |
| F03 | Ungültiger API Key (401) | Fehler in Konsole, Felder bleiben leer, App stabil | Akzeptabel |
| F04 | Foto sehr dunkel / unscharf | KI gibt schlechte Schätzung oder `no_food` zurück | Akzeptabel (Hinweis: Konfidenz-Feld) |
| F05 | Sehr grosses Foto (hohe Auflösung) | Qualität auf 0.7 reduziert, Base64 trotzdem gross | Akzeptabel |
| F06 | GPS-Berechtigung verweigert | Eintrag wird ohne Koordinaten gespeichert | Akzeptabel |
| F07 | App in den Hintergrund, dann zurück | Kamera muss neu initialisiert werden | Bekannte iOS-Einschränkung |

---

## 4. Nicht getestete Bereiche

- **Android:** Alle Tests wurden auf iOS durchgeführt. Android-spezifisches Verhalten (Adaptive Icon, Back-Gesture) nicht vollständig getestet.
- **Automatisierte Tests:** Es wurden ausschliesslich manuelle Tests durchgeführt.
- **Performance mit vielen Einträgen:** Verhalten bei über 500 Einträgen in der Datenbank nicht getestet.
- **Verschiedene Barcode-Typen:** Hauptsächlich mit EAN-13 getestet. EAN-8 und UPC-A nicht systematisch geprüft.

---

## 5. Fazit

Alle definierten Testfälle wurden erfolgreich bestanden. Die App verhält sich bei Fehlerszenarien (kein Internet, fehlender API-Key, GPS-Verweigerung) stabil und stürzt nicht ab. Die KI-Analyse liefert bei klaren, gut beleuchteten Fotos plausible Schätzwerte. Bei schlechter Bildqualität oder unbekannten Gerichten empfiehlt sich die manuelle Eingabe oder der Barcode-Scan als Alternative.
