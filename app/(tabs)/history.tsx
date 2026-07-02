import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { getMealsByDay } from '@/lib/db';

const DAY_LABELS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const BAR_HEIGHT = 140;
const GOAL_KEY   = 'dailyGoal';
const DEFAULT_GOAL = 2000;

type DayEntry = {
  date:    string;   // 'YYYY-MM-DD'
  label:   string;   // 'Mo'
  kcal:    number;
  meals:   number;
  isToday: boolean;
};

function getLast7Days(): DayEntry[] {
  const result: DayEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date:    d.toISOString().slice(0, 10),
      label:   DAY_LABELS[d.getDay()],
      kcal:    0,
      meals:   0,
      isToday: i === 0,
    });
  }
  return result;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [days, setDays]   = useState<DayEntry[]>(getLast7Days());
  const [goal, setGoal]   = useState(DEFAULT_GOAL);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const [dbDays, storedGoal] = await Promise.all([
          getMealsByDay(),
          AsyncStorage.getItem(GOAL_KEY),
        ]);

        const g = storedGoal ? parseInt(storedGoal, 10) : DEFAULT_GOAL;
        setGoal(isNaN(g) ? DEFAULT_GOAL : g);

        // Merge DB-Daten in die letzten 7 Tage
        const skeleton = getLast7Days();
        const byDate = Object.fromEntries(dbDays.map(d => [d.day, d]));
        setDays(
          skeleton.map(entry => {
            const db = byDate[entry.date];
            return db
              ? { ...entry, kcal: Math.round(db.total_calories), meals: db.meals.length }
              : entry;
          }),
        );
      };
      load();
    }, []),
  );

  const max = Math.max(...days.map(d => d.kcal), goal);

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
            {/* Ziel-Linie */}
            <View style={[styles.goalLine, { bottom: (goal / max) * BAR_HEIGHT }]}>
              <Text style={styles.goalLineLabel}>Ziel</Text>
            </View>

            {days.map(d => {
              const barH    = d.kcal > 0 ? (d.kcal / max) * BAR_HEIGHT : 4;
              const overGoal = d.kcal > goal;
              return (
                <View key={d.date} style={styles.barCol}>
                  {d.kcal > 0 && (
                    <Text style={styles.barValue}>
                      {d.kcal >= 1000 ? `${(d.kcal / 1000).toFixed(1)}k` : String(d.kcal)}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      { height: barH },
                      overGoal   && styles.barOver,
                      d.isToday  && styles.barToday,
                      d.kcal === 0 && styles.barEmpty,
                    ]}
                  />
                  <Text style={[styles.barDay, d.isToday && styles.barDayToday]}>
                    {d.label}
                  </Text>
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

        {/* Tagesliste */}
        <Text style={styles.sectionTitle}>Tage</Text>

        {days.slice().reverse().map(d => (
          <View key={d.date} style={styles.dayRow}>
            <View style={[styles.dayBadge, d.isToday && styles.dayBadgeToday]}>
              <Text style={[styles.dayBadgeText, d.isToday && styles.dayBadgeTextToday]}>
                {d.label}
              </Text>
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
                        width: `${Math.min((d.kcal / goal) * 100, 100)}%` as any,
                        backgroundColor: d.kcal > goal ? '#F4A261' : Palette.green400,
                      },
                    ]}
                  />
                </View>
              )}
            </View>

            <Text style={styles.dayMeals}>
              {d.meals > 0
                ? `${d.meals} Mahlzeit${d.meals !== 1 ? 'en' : ''}`
                : 'Keine Daten'}
            </Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.green50 },

  header: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: '500', marginTop: 2,
  },

  scroll: { padding: 16, gap: 12, paddingBottom: 32 },

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
    fontSize: 10, fontWeight: '700', color: Palette.muted, letterSpacing: 1, marginBottom: 16,
  },

  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_HEIGHT + 30,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute', left: 0, right: 0,
    height: 1, borderTopWidth: 1, borderColor: Palette.muted, borderStyle: 'dashed',
  },
  goalLineLabel: {
    position: 'absolute', right: 0, top: -16,
    fontSize: 10, color: Palette.muted, fontWeight: '600',
  },

  barCol:  { alignItems: 'center', flex: 1, gap: 4 },
  barValue: { fontSize: 9, color: Palette.muted, fontWeight: '600' },
  bar:     { width: 28, borderRadius: 8, backgroundColor: Palette.green400 },
  barOver:  { backgroundColor: '#F4A261' },
  barToday: { backgroundColor: Palette.green600 },
  barEmpty: { backgroundColor: Palette.green100, height: 4 },
  barDay:   { fontSize: 11, color: Palette.muted, fontWeight: '600' },
  barDayToday: { color: Palette.green600, fontWeight: '800' },

  legend:     { flexDirection: 'row', gap: 16, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: Palette.muted, fontWeight: '500' },

  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: Palette.green900, marginTop: 4,
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
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Palette.green100,
    alignItems: 'center', justifyContent: 'center',
  },
  dayBadgeToday: { backgroundColor: Palette.green400 },
  dayBadgeText:  { fontSize: 13, fontWeight: '700', color: Palette.green600 },
  dayBadgeTextToday: { color: '#fff' },
  dayInfo:  { flex: 1, gap: 6 },
  dayKcal:  { fontSize: 15, fontWeight: '700', color: Palette.green900 },
  miniTrack: {
    height: 5, backgroundColor: Palette.green100, borderRadius: 3, overflow: 'hidden',
  },
  miniFill:  { height: 5, borderRadius: 3 },
  dayMeals:  { fontSize: 11, color: Palette.muted, fontWeight: '500' },
});
