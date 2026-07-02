import { Platform } from 'react-native';

// ─── Farbpalette ──────────────────────────────────────────────────────────────
// Pastellgrün als Leitfarbe: vermittelt Frische, Gesundheit und Ruhe
// ohne klinisch-steril zu wirken. Die Abstufungen decken alle UI-Ebenen ab.
export const Palette = {
  // Primär – Pastellgrün
  green50:  '#F2F9F4',  // Seitenhintergrund, hauchzarter Hintergrund
  green100: '#D8EFE0',  // Karten-Hintergrund, Tags, Chips
  green200: '#B8DFC8',  // Placeholder, deaktivierte Elemente
  green300: '#8FCAAB',  // Subtitle-Icons, Trennlinien
  green400: '#7DC995',  // Primary – Buttons, aktive Tab-Leiste
  green500: '#52A875',  // Primary Dark – Hover, Fortschrittsbalken
  green600: '#3A7D55',  // Akzent dunkel – Badges, Überschriften auf Grün
  green900: '#1E3D2B',  // Text dunkel – Headlines, primärer Fliesstext

  // Akzentfarbe – warmes Amber (Kontrast zu Grün, für CTAs und Warnungen)
  amber100: '#FEF3C7',  // Hintergrund Warn-Badge
  amber400: '#FBBF24',  // Warn-Icon, Streak-Highlight
  amber500: '#F59E0B',  // Warn-Button-Hintergrund

  // Gefahr / Überschuss
  red100:   '#FEE2E2',
  red400:   '#F87171',  // Kalorienziel überschritten
  red500:   '#EF4444',

  // Neutrale Töne
  white:    '#FFFFFF',
  gray50:   '#F9FAFB',
  gray100:  '#F3F4F6',
  gray200:  '#E5E7EB',
  gray400:  '#9CA3AF',
  gray600:  '#4B5563',
  gray900:  '#111827',

  // Aliasse (Rückwärtskompatibilität mit bestehendem Code)
  muted:    '#7BA08A',
  shadow:   '#000000',
};

// ─── Farbzuweisungen (Light / Dark Mode) ──────────────────────────────────────
export const Colors = {
  light: {
    text:            Palette.green900,
    background:      Palette.green50,
    tint:            Palette.green500,
    icon:            Palette.muted,
    tabIconDefault:  '#AECBB8',
    tabIconSelected: Palette.green500,
    card:            Palette.white,
    primary:         Palette.green400,
    primaryDark:     Palette.green500,
    primaryLight:    Palette.green100,
    textMuted:       Palette.muted,
    warn:            Palette.amber500,
    danger:          Palette.red500,
  },
  dark: {
    text:            '#ECEDEE',
    background:      '#151718',
    tint:            Palette.green400,
    icon:            '#9BA1A6',
    tabIconDefault:  '#9BA1A6',
    tabIconSelected: Palette.green400,
    card:            '#1E2824',
    primary:         Palette.green400,
    primaryDark:     Palette.green500,
    primaryLight:    Palette.green900,
    textMuted:       '#9BA1A6',
    warn:            Palette.amber400,
    danger:          Palette.red400,
  },
};

// ─── Typografie ───────────────────────────────────────────────────────────────
// Empfehlung: @expo-google-fonts/nunito
// Schriftart: Nunito (rounded, modern, freundlich – passt zu pastelligem Stil)
// Installation: npx expo install @expo-google-fonts/nunito expo-font
export const FontFamily = Platform.select({
  ios: {
    regular:    'Nunito_400Regular',
    medium:     'Nunito_600SemiBold',
    bold:       'Nunito_700Bold',
    extraBold:  'Nunito_800ExtraBold',
    // Fallback falls Fonts noch nicht geladen
    fallback:   'system-ui',
  },
  default: {
    regular:    'Nunito_400Regular',
    medium:     'Nunito_600SemiBold',
    bold:       'Nunito_700Bold',
    extraBold:  'Nunito_800ExtraBold',
    fallback:   'normal',
  },
});

// Schriftgrössen-Skala
export const FontSize = {
  xs:      11,  // Caption, Timestamps, Badges
  sm:      13,  // Labels, Subtexte, Tab-Beschriftungen
  base:    15,  // Body-Text Standard
  md:      17,  // Body Lead, Buttons
  lg:      20,  // Section-Titel, H3
  xl:      24,  // H2 – Tagesüberschrift, Kartenheadlines
  xxl:     30,  // H1 – Begrüssung ("Hallo Noel!")
  display: 40,  // Grosse Kalorien-Anzeige auf Home-Screen
};

export const LineHeight = {
  tight:   1.2,  // Headlines
  normal:  1.5,  // Body
  relaxed: 1.7,  // Lesbarkeit bei längeren Texten
};

// Rückwärtskompatibler Alias
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Abstands-Skala (8-pt Grid) ───────────────────────────────────────────────
export const Spacing = {
  xxs:  2,
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
  huge: 64,
};

// ─── Eckenradius-Skala ────────────────────────────────────────────────────────
export const Radius = {
  xs:   6,    // Kleine Chips, Tags
  sm:   10,   // Input-Felder
  md:   16,   // Karten, Modal-Sheets
  lg:   22,   // Grosse Karten, Foto-Vorschau
  xl:   32,   // Haupt-CTA-Buttons
  full: 9999, // Pillen-Buttons, Badges
};

// ─── Schatten-Stile ───────────────────────────────────────────────────────────
export const Shadow = {
  // Weicher, fast unsichtbarer Hauch für Karten
  card: {
    shadowColor:   Palette.shadow,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     2,
  },
  // Deutlicherer Schatten für schwebende Elemente (FAB, Modal)
  elevated: {
    shadowColor:   Palette.shadow,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation:     6,
  },
  // Farbiger Schatten für primäre Buttons (Green-Glow-Effekt)
  button: {
    shadowColor:   Palette.green500,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  10,
    elevation:     4,
  },
};
