import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

const DAILY_GOAL = 2000;
const todayCalories = 0;
const progress = todayCalories / DAILY_GOAL;

const todayLabel = new Date().toLocaleDateString('de-CH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const macros = [
  { label: 'Protein', value: '0g', color: Palette.green400 },
  { label: 'Carbs',   value: '0g', color: Palette.green300 },
  { label: 'Fett',    value: '0g', color: Palette.green200 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.headerDate}>{todayLabel}</Text>
          <Text style={styles.headerTitle}>SnapMeal</Text>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/gallery')}
            activeOpacity={0.7}>
            <Ionicons name="grid-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* ── Kalorien-Karte ── */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>HEUTIGE KALORIEN</Text>

          <View style={styles.calorieRow}>
            <Text style={styles.calorieNum}>{todayCalories.toLocaleString('de-CH')}</Text>
            <Text style={styles.calorieGoal}> / {DAILY_GOAL.toLocaleString('de-CH')} kcal</Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%` as any }]} />
          </View>
          <Text style={styles.progressLabel}>
            {Math.round(progress * 100)}% deines Tagesziels
          </Text>

          <View style={styles.macroRow}>
            {macros.map((m) => (
              <View key={m.label} style={styles.macroChip}>
                <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                <Text style={styles.macroVal}>{m.value}</Text>
                <Text style={styles.macroLbl}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Heutige Mahlzeiten ── */}
        <Text style={styles.sectionTitle}>Heutige Mahlzeiten</Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🥗</Text>
          <Text style={styles.emptyTitle}>Noch keine Mahlzeiten</Text>
          <Text style={styles.emptySubtitle}>
            Mach ein Foto deiner Mahlzeit und lass die KI{'\n'}Kalorien und Nährwerte schätzen.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/new-entry')}
            activeOpacity={0.8}>
            <Ionicons name="camera" size={18} color="#fff" />
            <Text style={styles.emptyBtnText}>Jetzt fotografieren</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.green50,
  },

  // Header
  header: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },

  // Kalorien-Karte
  card: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 20,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 18,
  },
  calorieNum: {
    fontSize: 44,
    fontWeight: '800',
    color: Palette.green900,
    letterSpacing: -1.5,
  },
  calorieGoal: {
    fontSize: 15,
    color: Palette.muted,
    fontWeight: '500',
    marginLeft: 2,
  },
  track: {
    height: 10,
    backgroundColor: Palette.green100,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    backgroundColor: Palette.green400,
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: Palette.muted,
    marginTop: 7,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 8,
  },
  macroChip: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Palette.green50,
    borderRadius: 14,
    padding: 10,
    gap: 3,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroVal: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.green900,
  },
  macroLbl: {
    fontSize: 10,
    color: Palette.muted,
    fontWeight: '600',
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.green900,
    marginTop: 4,
  },

  // Empty state
  emptyCard: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    gap: 6,
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.green900,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Palette.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.green400,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 50,
    marginTop: 8,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
