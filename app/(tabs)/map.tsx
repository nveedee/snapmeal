import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

// TODO Ron: Meal-Marker aus DB laden und hier als <Marker>-Komponenten einfügen (Phase 4)
// Beispiel:
// <Marker key={meal.id} coordinate={{ latitude: meal.latitude!, longitude: meal.longitude! }}
//         onPress={() => router.push(`/meal/${meal.id}`)} />

const SWITZERLAND: Region = {
  latitude: 46.8182,
  longitude: 8.2275,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

type LocStatus = 'idle' | 'loading' | 'granted' | 'denied';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [locStatus, setLocStatus] = useState<LocStatus>('idle');

  const goToCurrentLocation = async () => {
    setLocStatus('loading');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocStatus('denied');
      return;
    }
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLocStatus('granted');
    mapRef.current?.animateToRegion(
      {
        latitude:      pos.coords.latitude,
        longitude:     pos.coords.longitude,
        latitudeDelta:  0.04,
        longitudeDelta: 0.04,
      },
      700,
    );
  };

  useEffect(() => {
    goToCurrentLocation();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.headerTitle}>Karte</Text>
          <Text style={styles.headerSubtitle}>Wo hast du was gegessen?</Text>
        </View>

        <TouchableOpacity
          style={styles.locBtn}
          onPress={goToCurrentLocation}
          activeOpacity={0.75}
          disabled={locStatus === 'loading'}>
          {locStatus === 'loading' ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons
              name={locStatus === 'denied' ? 'location-outline' : 'locate'}
              size={20}
              color="#fff"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Karte */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={SWITZERLAND}
        showsUserLocation={locStatus === 'granted'}
        showsMyLocationButton={false}
        showsCompass
        showsScale>
        {/* TODO Ron: Meal-Marker hier einfügen (Phase 4) */}
      </MapView>

      {/* Hinweis bei verweigertem Standort */}
      {locStatus === 'denied' && (
        <View style={styles.banner}>
          <Ionicons name="location-outline" size={14} color={Palette.muted} />
          <Text style={styles.bannerText}>
            Standort-Zugriff verweigert – in den Einstellungen aktivieren
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.green50 },

  // Header
  header: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  locBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  map: { flex: 1 },

  banner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Palette.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: Palette.muted,
    fontWeight: '500',
  },
});
