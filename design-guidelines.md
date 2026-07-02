# SnapMeal Design Guidelines

> KI-generiert (Claude Code / Claude Sonnet 4.6, 02.07.2026)  
> Zweck: Visuelles Design-System für App-UI und Marketing-Material (App-Store-Screenshots, Icon, Social-Media-Assets).

---

## 1. Farbpalette

**Stimmung:** Modern, frisch, gesund – pastellig ohne steril zu wirken. Pastellgrün signalisiert Natur und Balance; Amber als Akzent bringt Wärme und lenkt gezielt Aufmerksamkeit.

| Token | Hex | Verwendung |
|---|---|---|
| `green50` | `#F2F9F4` | Seitenhintergrund |
| `green100` | `#D8EFE0` | Karten-Hintergrund, Tags |
| `green200` | `#B8DFC8` | Placeholder, deaktiviert |
| `green300` | `#8FCAAB` | Icons, Trennlinien |
| **`green400`** | **`#7DC995`** | **Primary – Buttons, aktive Tab** |
| `green500` | `#52A875` | Primary Dark – Fortschrittsbalken |
| `green600` | `#3A7D55` | Badges, Akzent auf Grün |
| `green900` | `#1E3D2B` | Headlines, primärer Text |
| `amber400` | `#FBBF24` | Warnungen, Streak-Highlights |
| `amber500` | `#F59E0B` | Warn-Buttons |
| `red400` | `#F87171` | Kalorienziel überschritten |
| `white` | `#FFFFFF` | Karten-Hintergrund, Modals |

### Warum diese Farben?
- **Pastellgrün** (`green400 #7DC995`) ist satt genug für AA-Kontrast auf Weiss, aber weich genug um nicht aggressiv zu wirken.
- **Amber** (`amber400`) ergänzt Grün harmonisch als Komplement-Kontrast (Farbrad: Gelb-Orange ↔ Blau-Grün) und signalisiert sofort „Achtung" ohne rot-aggressiv zu sein.
- Die **grüne Ton-Leiter** (50→900) erlaubt ein vollständiges UI-System aus einer einzigen Hue, was visuelle Ruhe erzeugt.

---

## 2. Typografie

**Empfohlene Schriftart:** [Nunito](https://fonts.google.com/specimen/Nunito)  
Rounded-Terminals, geometrisch-freundlich, optimal für eine Health-App ohne kindisch zu wirken.

**Installation:**
```bash
npx expo install @expo-google-fonts/nunito expo-font
```

**Einbindung in `app/_layout.tsx`:**
```tsx
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
```

### Grössensskala

| Rolle | Token | Grösse | Gewicht | Verwendung |
|---|---|---|---|---|
| Display | `FontSize.display` | 40 | 800 ExtraBold | Kalorien-Anzeige Home |
| H1 | `FontSize.xxl` | 30 | 700 Bold | Begrüssung „Hallo!" |
| H2 | `FontSize.xl` | 24 | 700 Bold | Tagesübersicht, Sektionsheader |
| H3 | `FontSize.lg` | 20 | 600 SemiBold | Karten-Titel |
| Body | `FontSize.base` | 15 | 400 Regular | Fliesstext |
| Label | `FontSize.sm` | 13 | 600 SemiBold | Feld-Labels, Tab-Text |
| Caption | `FontSize.xs` | 11 | 400 Regular | Timestamps, Badges |

---

## 3. UI-Stilregeln

### Eckenradius
```
Chips / Badges    → Radius.full  (9999) – Pille
CTA-Buttons       → Radius.xl    (32)
Grosse Karten     → Radius.lg    (22)
Modals / Sheets   → Radius.md    (16)
Input-Felder      → Radius.sm    (10)
```

### Abstands-Skala (8-pt Grid)
```
Innen-Padding Karte    → Spacing.base (16)
Zwischen Elementen     → Spacing.sm   (8) / Spacing.md (12)
Seiten-Padding Screen  → Spacing.base (16)
Vertikal zwischen Cards → Spacing.md  (12)
```

### Schatten
- **Karten**: `Shadow.card` – minimal, hauchzart (elevation 2)
- **Modals / Bottom Sheets**: `Shadow.elevated` – sichtbarer (elevation 6)
- **Primary Buttons**: `Shadow.button` – grüner Glow (shadowColor: green500)

### Icon-Stil
- Bibliothek: **Ionicons** (bereits in Expo enthalten)
- Stil: `-outline` Varianten für inaktive Zustände, filled für aktiv/ausgewählt
- Grösse: 22px in der Navigationsleiste, 20px in Buttons, 16px in Labels

---

## 4. Beispiel-Kombinationen

### A) Primary CTA Button
```
Hintergrund:  green400 (#7DC995)
Text:         white, FontSize.md (17), Nunito_700Bold
Border Radius: Radius.xl (32)
Padding:      Spacing.base vertikal, Spacing.xxl horizontal
Schatten:     Shadow.button (green-Glow)
Icon:         Ionicons, 20px, white, links neben Text
```

### B) Inhaltskarte (z.B. Mahlzeit-Eintrag)
```
Hintergrund:  white
Border Radius: Radius.lg (22)
Padding:      Spacing.base (16)
Schatten:     Shadow.card
Titel:        FontSize.md (17), Nunito_700Bold, green900
Subtitel:     FontSize.sm (13), Nunito_400Regular, muted (#7BA08A)
Trennlinie:   1px, green50 (#F2F9F4)
```

### C) Tagesfortschritts-Balken
```
Hintergrund (leer): green100 (#D8EFE0), Radius.full, Höhe 10px
Füllung (Fortschritt): green400 → green500 (Gradient oder solid)
Überschuss (> 100%): red400 (#F87171)
Nahe Limit (> 85%): amber400 (#FBBF24)
Label darüber: FontSize.sm (13), Nunito_600SemiBold, green900
Kalorien-Zahl: FontSize.display (40), Nunito_800ExtraBold, green900
```

---

## 5. App-Icon & Marketing

- **Hintergrund:** `green400` (#7DC995) oder radialer Gradient `green300 → green500`
- **Icon-Symbol:** weisses Teller-/Kamera-Piktogramm, rounded corners
- **App-Store-Screenshots:** `green50` Hintergrund, Geräte-Mock mit leichtem `Shadow.elevated`
- **Social-Media:** grüner Gradient-Banner, Nunito ExtraBold für Slogan, weisse Schrift
