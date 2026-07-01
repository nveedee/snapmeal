import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

const GOAL_KEY = 'dailyGoal';
const NAME_KEY = 'userName';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [goalInput, setGoalInput] = useState('2000');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [goal, name] = await Promise.all([
        AsyncStorage.getItem(GOAL_KEY),
        AsyncStorage.getItem(NAME_KEY),
      ]);
      if (goal) setGoalInput(goal);
      if (name) setNameInput(name);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    const parsed = parseInt(goalInput, 10);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Ungültiger Wert', 'Bitte gib ein gültiges Kalorien-Ziel ein (z.B. 2000).');
      return;
    }
    setSaving(true);
    await Promise.all([
      AsyncStorage.setItem(GOAL_KEY, String(parsed)),
      AsyncStorage.setItem(NAME_KEY, nameInput.trim()),
    ]);
    setSaving(false);
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={Palette.green400} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Palette.green900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Einstellungen</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Profil */}
        <Text style={styles.sectionLabel}>PROFIL</Text>
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="person-outline" size={18} color={Palette.green500} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dein Name"
                placeholderTextColor={Palette.green200}
                value={nameInput}
                onChangeText={setNameInput}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>

        {/* Tagesziel */}
        <Text style={styles.sectionLabel}>TAGESZIEL</Text>
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="flame-outline" size={18} color={Palette.green500} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Kalorien-Ziel pro Tag</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="2000"
                  placeholderTextColor={Palette.green200}
                  keyboardType="numeric"
                  value={goalInput}
                  onChangeText={setGoalInput}
                  returnKeyType="done"
                  maxLength={5}
                />
                <Text style={styles.inputUnit}>kcal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Speichern */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Speichern</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>SnapMeal · Modul 335 · 2026</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.green50 },
  centered: { alignItems: 'center', justifyContent: 'center' },

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
  headerTitle: { fontSize: 17, fontWeight: '700', color: Palette.green900 },

  scroll: { padding: 16, gap: 8, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.muted,
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 4,
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
  fieldRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  fieldIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Palette.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: { flex: 1, gap: 4 },
  fieldLabel: { fontSize: 12, color: Palette.muted, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { fontSize: 16, fontWeight: '600', color: Palette.green900, paddingVertical: 2 },
  inputUnit: { fontSize: 14, color: Palette.muted, fontWeight: '500' },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.green400,
    borderRadius: 50,
    paddingVertical: 15,
    marginTop: 16,
    shadowColor: Palette.green500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  version: { textAlign: 'center', fontSize: 12, color: Palette.green200, fontWeight: '500', marginTop: 8 },
});
