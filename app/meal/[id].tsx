import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { Meal, deleteMeal, getMealById } from '@/lib/db';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })
    + ', '
    + d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
}

function formatCoords(lat: number | null, lon: number | null): string {
  if (lat == null || lon == null) return 'Kein Standort';
  return `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° O`;
}

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Eintrag löschen',
      `„${meal?.food_name}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            if (!meal) return;
            setDeleting(true);
            await deleteMeal(meal.id);
            router.replace('/');
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (!id) return;
    getMealById(Number(id))
      .then(setMeal)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={Palette.green400} size="large" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={[styles.root, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={48} color={Palette.muted} />
        <Text style={styles.notFoundText}>Mahlzeit nicht gefunden</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const macros = [
    { label: 'Kalorien', value: meal.calories != null ? Math.round(meal.calories).toString() : '—', unit: 'kcal', color: Palette.green400 },
    { label: 'Protein',  value: meal.protein_g != null ? Math.round(meal.protein_g).toString() : '—', unit: 'g', color: Palette.green300 },
    { label: 'Carbs',    value: meal.carbs_g   != null ? Math.round(meal.carbs_g).toString()   : '—', unit: 'g', color: Palette.green200 },
    { label: 'Fett',     value: meal.fat_g     != null ? Math.round(meal.fat_g).toString()     : '—', unit: 'g', color: '#C8E6C9' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Foto-Header ── */}
      <View style={[styles.photoHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        {meal.photo_uri ? (
          <Image
            source={{ uri: meal.photo_uri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="restaurant-outline" size={56} color="rgba(255,255,255,0.4)" />
          </View>
        )}

        {/* Overlay so back button is always visible over photo */}
        <View style={styles.photoOverlay} />
        <TouchableOpacity
          style={[styles.backBtn, styles.backBtnAbsolute, { top: insets.top + 10 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Name + Meta ── */}
        <View>
          <Text style={styles.mealName}>{meal.food_name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={Palette.muted} />
            <Text style={styles.metaText}>
              {formatDateTime(meal.timestamp)}{meal.grams ? ` · ${meal.grams} ${meal.unit ?? 'g'}` : ''}
            </Text>
          </View>
        </View>

        {/* ── Nährwert-Kacheln ── */}
        <View style={styles.macroGrid}>
          {macros.map((m) => (
            <View key={m.label} style={styles.macroCard}>
              <View style={[styles.macroDot, { backgroundColor: m.color }]} />
              <Text style={styles.macroVal}>{m.value}</Text>
              <Text style={styles.macroUnit}>{m.unit}</Text>
              <Text style={styles.macroLbl}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Standort ── */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.cardIcon, { backgroundColor: meal.latitude != null ? Palette.green100 : '#FFF3E0' }]}>
              <Ionicons
                name={meal.latitude != null ? 'location' : 'location-outline'}
                size={20}
                color={meal.latitude != null ? Palette.green500 : '#F4A261'}
              />
            </View>
            <View>
              <Text style={styles.cardRowLabel}>Standort</Text>
              <Text style={styles.cardRowValue}>{formatCoords(meal.latitude, meal.longitude)}</Text>
            </View>
          </View>
        </View>

        {/* ── Löschen ── */}
        <TouchableOpacity
          style={[styles.deleteBtn, deleting && { opacity: 0.5 }]}
          onPress={handleDelete}
          activeOpacity={0.8}
          disabled={deleting}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteBtnText}>Eintrag löschen</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const PHOTO_HEIGHT = 280;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.green50 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, fontWeight: '600', color: Palette.muted },
  backLink: { fontSize: 15, color: Palette.green500, fontWeight: '700' },

  photoHeader: {
    height: PHOTO_HEIGHT,
    backgroundColor: Palette.green300,
    overflow: 'hidden',
    position: 'relative',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  photoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  backBtnAbsolute: {
    position: 'absolute',
    left: 6,
    margin: 0,
  },

  scroll: { padding: 16, gap: 14, paddingBottom: 40 },

  mealName: { fontSize: 26, fontWeight: '800', color: Palette.green900, letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  metaText: { fontSize: 13, color: Palette.muted, fontWeight: '500' },

  macroGrid: { flexDirection: 'row', gap: 10 },
  macroCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  macroDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  macroVal: { fontSize: 18, fontWeight: '800', color: Palette.green900 },
  macroUnit: { fontSize: 10, color: Palette.muted, fontWeight: '600', marginTop: -2 },
  macroLbl: { fontSize: 10, color: Palette.muted, fontWeight: '600', marginTop: 2 },

  card: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardRowLabel: { fontSize: 11, color: Palette.muted, fontWeight: '600' },
  cardRowValue: { fontSize: 14, fontWeight: '600', color: Palette.green900, marginTop: 2 },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 50,
    paddingVertical: 14,
    backgroundColor: '#FFF5F5',
    marginTop: 4,
  },
  deleteBtnText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
});
