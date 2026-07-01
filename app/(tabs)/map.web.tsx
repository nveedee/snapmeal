import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

export default function MapScreenWeb() {
  return (
    <View style={styles.root}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.title}>Karte nur in Expo Go</Text>
      <Text style={styles.text}>
        Die interaktive Karte ist auf iOS und Android{'\n'}über Expo Go verfügbar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32, backgroundColor: Palette.green50 },
  icon:  { fontSize: 52 },
  title: { fontSize: 17, fontWeight: '700', color: Palette.green900 },
  text:  { fontSize: 13, color: Palette.muted, textAlign: 'center', lineHeight: 20 },
});
