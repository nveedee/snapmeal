import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { Meal, getAllMeals } from '@/lib/db';

const { width } = Dimensions.get('window');
const GAP = 2;
const COL = 3;
const CELL = (width - GAP * (COL - 1)) / COL;

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMeals()
      .then((all) => setMeals(all.filter((m) => m.photo_uri)))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.cell}
      onPress={() => router.push(`/meal/${item.id}`)}
      activeOpacity={0.85}>
      <Image source={{ uri: item.photo_uri! }} style={styles.cellImage} contentFit="cover" />
      <View style={styles.cellOverlay}>
        <Text style={styles.cellKcal}>{item.calories ? `${item.calories} kcal` : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Palette.green900} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Foto-Tagebuch</Text>
          <Text style={styles.headerSubtitle}>
            {meals.length} {meals.length === 1 ? 'Mahlzeit' : 'Mahlzeiten'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => router.push('/(tabs)/new-entry')}
          activeOpacity={0.75}>
          <Ionicons name="camera" size={20} color={Palette.green500} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      {!loading && meals.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="images-outline" size={48} color={Palette.green300} />
          </View>
          <Text style={styles.emptyTitle}>Noch keine Fotos</Text>
          <Text style={styles.emptySubtitle}>
            Fotografiere deine Mahlzeiten – sie erscheinen hier automatisch.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/new-entry')}
            activeOpacity={0.85}>
            <Ionicons name="camera" size={18} color="#fff" />
            <Text style={styles.emptyBtnText}>Jetzt fotografieren</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(m) => String(m.id)}
          renderItem={renderItem}
          numColumns={COL}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.green50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.green100,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.green900,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.muted,
    fontWeight: '500',
    marginTop: 1,
  },
  cameraBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid
  cell: {
    width: CELL,
    height: CELL,
    backgroundColor: Palette.green100,
    position: 'relative',
  },
  cellImage: {
    width: CELL,
    height: CELL,
  },
  cellOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cellKcal: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 10,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.green100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
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
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 50,
    marginTop: 4,
    shadowColor: Palette.green500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
