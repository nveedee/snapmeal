import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

// TODO Ron: Verlauf/Statistik mit Balkendiagramm (Phase 5)

const MOCK_DAYS = [
  { day: 'Mo', kcal: 1840 },
  { day: 'Di', kcal: 2100 },
  { day: 'Mi', kcal: 1650 },
  { day: 'Do', kcal: 1920 },
  { day: 'Fr', kcal: 2250 },
  { day: 'Sa', kcal: 1400 },
  { day: 'So', kcal: 0 },
];

const GOAL = 2000;
const MAX = Math.max(...MOCK_DAYS.map((d) => d.kcal), GOAL);
const BAR_HEIGHT = 140;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.headerTitle}>Verlauf</Text>
        <Text style={styles.headerSubtitle}>Kalorien der letzten 7 Tage</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Balkendiagramm */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DIESE WOCHE</Text>

          <View style={styles.chart}>
            {/* Goal line */}
            <View style={[styles.goalLine, { bottom: (GOAL / MAX) * BAR_HEIGHT }]}>
              <Text style={styles.goalLineLabel}>Ziel</Text>
            </View>

            {MOCK_DAYS.map((d) => {
              const barH = d.kcal > 0 ? (d.kcal / MAX) * BAR_HEIGHT : 4;
              const overGoal = d.kcal > GOAL;
              const isToday = d.day === 'So';
              return (
                <View key={d.day} style={styles.barCol}>
                  {d.kcal > 0 && (
                    <Text style={styles.barValue}>{(d.kcal / 1000).toFixed(1)}k</Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      { height: barH },
                      overGoal && styles.barOver,
                      isToday && styles.barToday,
                      d.kcal === 0 && styles.barEmpty,
                    ]}
                  />
                  <Text style={[styles.barDay, isToday && styles.barDayToday]}>{d.day}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Palette.green400 }]} />
              <Text style={styles.legendText}>Im Ziel</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F4A261' }]} />
              <Text style={styles.legendText}>Über Ziel</Text>
            </View>
          </View>
        </View>

        {/* Wochenübersicht */}
        <Text style={styles.sectionTitle}>Tage</Text>

        {MOCK_DAYS.slice().reverse().map((d) => (
          <View key={d.day} style={styles.dayRow}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{d.day}</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayKcal}>
                {d.kcal > 0 ? `${d.kcal.toLocaleString('de-CH')} kcal` : '—'}
              </Text>
              {d.kcal > 0 && (
                <View style={styles.miniTrack}>
                  <View
                    style={[
                      styles.miniFill,
                      {
                        width: `${Math.min((d.kcal / GOAL) * 100, 100)}%` as any,
                        backgroundColor: d.kcal > GOAL ? '#F4A261' : Palette.green400,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
            <Text style={styles.dayMeals}>{d.kcal > 0 ? '3 Mahlzeiten' : 'Keine Daten'}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.green50,
  },
  header: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    letterSpacing: 1,
    marginBottom: 16,
  },

  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_HEIGHT + 30,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderColor: Palette.muted,
    borderStyle: 'dashed',
  },
  goalLineLabel: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
    color: Palette.muted,
    fontWeight: '600',
  },

  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  barValue: {
    fontSize: 9,
    color: Palette.muted,
    fontWeight: '600',
  },
  bar: {
    width: 28,
    borderRadius: 8,
    backgroundColor: Palette.green400,
  },
  barOver: {
    backgroundColor: '#F4A261',
  },
  barToday: {
    backgroundColor: Palette.green600,
  },
  barEmpty: {
    backgroundColor: Palette.green100,
    height: 4,
  },
  barDay: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '600',
  },
  barDayToday: {
    color: Palette.green600,
    fontWeight: '800',
  },

  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Palette.muted,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.green900,
    marginTop: 4,
  },

  dayRow: {
    backgroundColor: Palette.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Palette.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.green600,
  },
  dayInfo: {
    flex: 1,
    gap: 6,
  },
  dayKcal: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.green900,
  },
  miniTrack: {
    height: 5,
    backgroundColor: Palette.green100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniFill: {
    height: 5,
    borderRadius: 3,
  },
  dayMeals: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '500',
  },
});
