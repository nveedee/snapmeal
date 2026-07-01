import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { insertMeal } from '@/lib/db';

// ─── ELIAS – Phase 2.2 Hook ──────────────────────────────────────────────────
// 1. Erstelle lib/foodAI.ts mit analyzeFoodImage(base64: string)
// 2. Übergib base64 in new-entry.tsx: takePictureAsync({ base64: true })
// 3. Füge hier folgenden Code ein (nach den useState-Deklarationen):
//
//   useEffect(() => {
//     if (!params.photoBase64) return;
//     setAiLoading(true);
//     analyzeFoodImage(params.photoBase64 as string)
//       .then(result => {
//         if (!result) return;
//         setFoodName(result.food_name);
//         setGrams(String(result.estimated_grams ?? ''));
//         setCalories(String(result.calories ?? ''));
//         setProtein(String(result.protein_g ?? ''));
//         setCarbs(String(result.carbs_g ?? ''));
//         setFat(String(result.fat_g ?? ''));
//       })
//       .finally(() => setAiLoading(false));
//   }, []);
//
// 4. Aktiviere das aiBadge (aiLoading-State ist schon vorbereitet).
// ─────────────────────────────────────────────────────────────────────────────

export default function ConfirmEntryScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ photoUri: string }>();
  const photoUri = params.photoUri ?? null;

  // Form state
  const [foodName, setFoodName] = useState('');
  const [grams,    setGrams]    = useState('');
  const [calories, setCalories] = useState('');
  const [protein,  setProtein]  = useState('');
  const [carbs,    setCarbs]    = useState('');
  const [fat,      setFat]      = useState('');

  // UI state
  const [saving,    setSaving]    = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // Elias: AI-Analyse läuft

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Pflichtfeld', 'Bitte gib einen Gerichtnamen ein.');
      return;
    }
    const cal = parseFloat(calories);
    if (!calories || isNaN(cal)) {
      Alert.alert('Pflichtfeld', 'Bitte gib die Kalorien ein.');
      return;
    }

    setSaving(true);
    try {
      // GPS-Standort holen (optional – kein Fehler wenn verweigert)
      let latitude: number | null = null;
      let longitude: number | null = null;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude  = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      await insertMeal({
        photo_uri: photoUri,
        food_name: foodName.trim(),
        grams:     grams    ? parseFloat(grams)    : null,
        calories:  cal,
        protein_g: protein  ? parseFloat(protein)  : null,
        carbs_g:   carbs    ? parseFloat(carbs)    : null,
        fat_g:     fat      ? parseFloat(fat)      : null,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      router.replace('/');
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
      Alert.alert('Fehler', 'Eintrag konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.root}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={Palette.green900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Eintrag bestätigen</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Foto-Vorschau */}
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.photo}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Ionicons name="image-outline" size={48} color={Palette.green300} />
              <Text style={styles.photoPlaceholderText}>Kein Foto</Text>
            </View>
          )}

          {/* KI-Badge (Elias: aiLoading steuert den Inhalt) */}
          <View style={styles.aiBadge}>
            {aiLoading ? (
              <>
                <ActivityIndicator size="small" color={Palette.green500} />
                <Text style={styles.aiBadgeText}>KI analysiert Foto …</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={14} color={Palette.green500} />
                <Text style={styles.aiBadgeText}>Werte prüfen und anpassen</Text>
              </>
            )}
          </View>

          {/* Gericht */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>GERICHT</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="z.B. Spaghetti Bolognese"
                placeholderTextColor={Palette.green200}
                keyboardType="default"
                returnKeyType="next"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Menge</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={grams}
                  onChangeText={setGrams}
                  placeholder="350"
                  placeholderTextColor={Palette.green200}
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                <Text style={styles.inputUnit}>g</Text>
              </View>
            </View>
          </View>

          {/* Nährwerte */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>NÄHRWERTE</Text>

            {([
              { label: 'Kalorien *', value: calories, setter: setCalories, unit: 'kcal', keyboard: 'decimal-pad' as const },
              { label: 'Protein',   value: protein,  setter: setProtein,  unit: 'g',    keyboard: 'decimal-pad' as const },
              { label: 'Kohlenhydrate', value: carbs, setter: setCarbs,   unit: 'g',    keyboard: 'decimal-pad' as const },
              { label: 'Fett',      value: fat,      setter: setFat,      unit: 'g',    keyboard: 'decimal-pad' as const },
            ] as const).map((f, i, arr) => (
              <View key={f.label}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={f.value}
                      onChangeText={f.setter}
                      placeholder="0"
                      placeholderTextColor={Palette.green200}
                      keyboardType={f.keyboard}
                      returnKeyType={i < arr.length - 1 ? 'next' : 'done'}
                    />
                    <Text style={styles.inputUnit}>{f.unit}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* Speichern */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Eintrag speichern</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>* Pflichtfelder  ·  GPS wird automatisch erfasst</Text>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
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

  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 48,
  },

  photo: {
    width: '100%',
    height: 200,
    borderRadius: 22,
  },
  photoPlaceholder: {
    backgroundColor: Palette.green100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: Palette.green300,
    fontWeight: '500',
  },

  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.green100,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  aiBadgeText: {
    fontSize: 12,
    color: Palette.green600,
    fontWeight: '600',
  },

  card: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    letterSpacing: 1,
    paddingTop: 14,
    marginBottom: 2,
  },
  field: {
    paddingVertical: 12,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    color: Palette.muted,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.green900,
    paddingVertical: 2,
  },
  inputUnit: {
    fontSize: 14,
    color: Palette.muted,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Palette.green50,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.green400,
    borderRadius: 50,
    paddingVertical: 15,
    marginTop: 4,
    shadowColor: Palette.green500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: Palette.green200,
    marginTop: 4,
  },
});
