import { Platform } from 'react-native';

export const Palette = {
  green50:  '#F2F9F4',
  green100: '#D8EFE0',
  green200: '#B8DFC8',
  green300: '#8FCAAB',
  green400: '#7DC995',  // primary pastel green
  green500: '#52A875',  // accent / darker
  green600: '#3A7D55',
  green900: '#1E3D2B',  // dark text
  muted:    '#7BA08A',
  white:    '#FFFFFF',
  shadow:   '#000000',
};

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
  },
};

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
