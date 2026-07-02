# Testdokumentation – SnapMeal

**Projekt:** SnapMeal – Visuelles Kalorie-Tagebuch  
**Modul:** 335 – Mobile-Applikationen realisieren  
**Autor:** Noel von Däniken  
**Datum:** 02.07.2026  
**Testgerät:** iPhone, Expo Go  

---

## 1. Testumgebung

| Eigenschaft | Wert |
|---|---|
| Gerät | iPhone |
| Betriebssystem | iOS |
| Laufzeitumgebung | Expo Go |
| Expo SDK | 54.0.2 |
| Netzwerk | WLAN |

---

## 2. Testfälle

| # | Bereich | Testbeschreibung | Erwartetes Ergebnis | Status |
|---|---|---|---|---|
| T01 | Start | App erstmals starten | Datenbank wird erstellt, App lädt | ✅ |
| T02 | Kamera | Foto aufnehmen | Weiterleitung zu Bestätigungs-Screen mit Foto | ✅ |
| T03 | Kamera | Galerie-Bild auswählen | Bild erscheint im Bestätigungs-Screen | ✅ |
| T04 | Barcode | Evian-Flasche scannen (EAN-13) | Produktname und Nährwerte werden geladen | ✅ |
| T05 | Barcode | Unbekannten Barcode scannen | Warnung „Produkt nicht gefunden" erscheint | ✅ |
| T06 | KI | Foto einer Mahlzeit analysieren | Felder werden automatisch ausgefüllt | ✅ |
| T07 | KI | Foto ohne Essen aufnehmen | Felder bleiben leer, kein Absturz | ✅ |
| T08 | Formular | Ohne Name speichern | Fehlerdialog erscheint | ✅ |
| T09 | Formular | Gramm-Wert ändern | Nährwerte werden automatisch neu berechnet | ✅ |
| T10 | Formular | Einheit auf ml wechseln | Toggle wechselt, Wert wird als ml gespeichert | ✅ |
| T11 | Formular | Eintrag speichern | GPS wird erfasst, Eintrag auf Home sichtbar | ✅ |
| T12 | Home | Tagesübersicht | Kalorien und Mahlzeiten korrekt angezeigt | ✅ |
| T13 | Detail | Mahlzeit antippen | Detailansicht mit allen Nährwerten öffnet sich | ✅ |
| T14 | Detail | Eintrag löschen | Bestätigungs-Dialog, danach Eintrag entfernt | ✅ |
| T15 | Verlauf | Letzte 7 Tage | Tage mit Kalorien-Summen werden angezeigt | ✅ |
| T16 | Karte | Mahlzeit-Pins | Pins erscheinen an gespeicherten GPS-Standorten | ✅ |
| T17 | Karte | Pin antippen | Callout mit Name und Kalorien erscheint | ✅ |
| T18 | Einstellungen | Kalorienziel ändern | Neuer Wert bleibt nach Neustart erhalten | ✅ |
| T19 | Fehler | KI ohne WLAN | Timeout nach 20s, App bleibt stabil | ✅ |
| T20 | Fehler | GPS-Berechtigung verweigern | Eintrag wird ohne Koordinaten gespeichert | ✅ |

---

## 3. Fazit

Alle Testfälle wurden erfolgreich bestanden. Die App verhält sich bei Fehlersituationen (kein Internet, GPS verweigert) stabil und stürzt nicht ab. Die KI-Analyse liefert bei guten Fotos plausible Schätzwerte; bei schlechter Beleuchtung empfiehlt sich der Barcode-Scan oder manuelle Eingabe.
