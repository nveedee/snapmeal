import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { Meal, getMealsToday } from '@/lib/db';
import SnapMealLogo from '@/components/SnapMealLogo';

const GOAL_KEY = 'dailyGoal';
const DEFAULT_GOAL = 2000;

const todayLabel = new Date().toLocaleDateString('de-CH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_GOAL);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        const [todayMeals, storedGoal] = await Promise.all([
          getMealsToday(),
          AsyncStorage.getItem(GOAL_KEY),
        ]);
        if (!active) return;
        setMeals(todayMeals);
        setDailyGoal(storedGoal ? Number(storedGoal) : DEFAULT_GOAL);
        setLoading(false);
      }
      load();
      return () => { active = false; };
    }, []),
  );

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);
  const totalProtein  = meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0);
  const totalCarbs    = meals.reduce((sum, m) => sum + (m.carbs_g ?? 0), 0);
  const totalFat      = meals.reduce((sum, m) => sum + (m.fat_g ?? 0), 0);
  const progress      = dailyGoal > 0 ? Math.min(totalCalories / dailyGoal, 1) : 0;

  const macros = [
    { label: 'Protein', value: `${Math.round(totalProtein)}g`, color: Palette.green400 },
    { label: 'Carbs',   value: `${Math.round(totalCarbs)}g`,   color: Palette.green300 },
    { label: 'Fett',    value: `${Math.round(totalFat)}g`,     color: Palette.green200 },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerLeft}>
          <SnapMealLogo size={44} borderRadius={12} />
          <View>
            <Text style={styles.headerDate}>{todayLabel}</Text>
            <Text style={styles.headerTitle}>SnapMeal</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/gallery')}
            activeOpacity={0.7}>
            <Ionicons name="grid-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Palette.green400} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Kalorien-Karte ── */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>HEUTIGE KALORIEN</Text>

            <View style={styles.calorieRow}>
              <Text style={styles.calorieNum}>{Math.round(totalCalories).toLocaleString('de-CH')}</Text>
              <Text style={styles.calorieGoal}> / {dailyGoal.toLocaleString('de-CH')} kcal</Text>
            </View>

            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` as any }]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round(progress * 100)}% deines Tagesziels</Text>

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

          {meals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🥗</Text>
              <Text style={styles.emptyTitle}>Noch keine Mahlzeiten heute</Text>
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
          ) : (
            <View style={styles.mealList}>
              {meals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealRow}
                  onPress={() => router.push(`/meal/${meal.id}`)}
                  activeOpacity={0.75}>
                  {meal.photo_uri ? (
                    <Image source={{ uri: meal.photo_uri }} style={styles.mealThumb} contentFit="cover" />
                  ) : (
                    <View style={[styles.mealThumb, styles.mealThumbEmpty]}>
                      <Ionicons name="restaurant-outline" size={20} color={Palette.green300} />
                    </View>
                  )}
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName} numberOfLines={1}>{meal.food_name}</Text>
                    <Text style={styles.mealMeta}>{formatTime(meal.timestamp)}{meal.grams ? ` · ${meal.grams} g` : ''}</Text>
                  </View>
                  <View style={styles.mealKcalBox}>
                    <Text style={styles.mealKcal}>{meal.calories ? Math.round(meal.calories) : '—'}</Text>
                    <Text style={styles.mealKcalUnit}>kcal</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Palette.green200} />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.green50 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerBtns: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { padding: 16, gap: 16, paddingBottom: 32 },

  card: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLabel: { fontSize: 10, fontWeight: '700', color: Palette.muted, letterSpacing: 1, marginBottom: 10 },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 18 },
  calorieNum: { fontSize: 44, fontWeight: '800', color: Palette.green900, letterSpacing: -1.5 },
  calorieGoal: { fontSize: 15, color: Palette.muted, fontWeight: '500', marginLeft: 2 },
  track: { height: 10, backgroundColor: Palette.green100, borderRadius: 5, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: Palette.green400, borderRadius: 5 },
  progressLabel: { fontSize: 12, color: Palette.muted, marginTop: 7, fontWeight: '500' },
  macroRow: { flexDirection: 'row', marginTop: 18, gap: 8 },
  macroChip: { flex: 1, alignItems: 'center', backgroundColor: Palette.green50, borderRadius: 14, padding: 10, gap: 3 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroVal: { fontSize: 15, fontWeight: '700', color: Palette.green900 },
  macroLbl: { fontSize: 10, color: Palette.muted, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: Palette.green900, marginTop: 4 },

  // Meal list
  mealList: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.green50,
  },
  mealThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Palette.green100,
  },
  mealThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealInfo: { flex: 1, gap: 3 },
  mealName: { fontSize: 15, fontWeight: '600', color: Palette.green900 },
  mealMeta: { fontSize: 12, color: Palette.muted, fontWeight: '500' },
  mealKcalBox: { alignItems: 'flex-end' },
  mealKcal: { fontSize: 16, fontWeight: '800', color: Palette.green900 },
  mealKcalUnit: { fontSize: 10, color: Palette.muted, fontWeight: '600' },

  // Empty state
  emptyCard: {
    backgroundColor: Palette.white,
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Palette.green900 },
  emptySubtitle: { fontSize: 13, color: Palette.muted, textAlign: 'center', lineHeight: 20, marginBottom: 4 },
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
  emptyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
