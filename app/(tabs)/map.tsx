import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import { Palette } from '@/constants/theme';
import { Meal, getAllMeals } from '@/lib/db';

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
  const [meals, setMeals] = useState<Meal[]>([]);

  // Mahlzeiten neu laden wenn Tab geöffnet wird
  useFocusEffect(
    useCallback(() => {
      getAllMeals().then(setMeals);
    }, []),
  );

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

  const mealMarkers = meals.filter(m => m.latitude != null && m.longitude != null);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}. ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.headerTitle}>Karte</Text>
          <Text style={styles.headerSubtitle}>
            {mealMarkers.length > 0
              ? `${mealMarkers.length} Mahlzeit${mealMarkers.length !== 1 ? 'en' : ''} auf der Karte`
              : 'Wo hast du was gegessen?'}
          </Text>
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

        {mealMarkers.map(meal => (
          <Marker
            key={meal.id}
            coordinate={{ latitude: meal.latitude!, longitude: meal.longitude! }}>

            {/* Custom Marker-Pin */}
            <View style={styles.pin}>
              {meal.photo_uri ? (
                <Image source={{ uri: meal.photo_uri }} style={styles.pinPhoto} contentFit="cover" />
              ) : (
                <Ionicons name="restaurant" size={16} color={Palette.green600} />
              )}
            </View>

            {/* Callout-Popup beim Antippen */}
            <Callout onPress={() => router.push(`/meal/${meal.id}`)}>
              <View style={styles.callout}>
                {meal.photo_uri && (
                  <Image
                    source={{ uri: meal.photo_uri }}
                    style={styles.calloutPhoto}
                    contentFit="cover"
                  />
                )}
                <View style={styles.calloutInfo}>
                  <Text style={styles.calloutName} numberOfLines={1}>{meal.food_name}</Text>
                  {meal.calories != null && (
                    <Text style={styles.calloutCal}>{Math.round(meal.calories)} kcal</Text>
                  )}
                  <Text style={styles.calloutDate}>{formatDate(meal.timestamp)}</Text>
                  <Text style={styles.calloutHint}>Tippen für Details →</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>

      {/* Kein GPS-Eintrag vorhanden */}
      {mealMarkers.length === 0 && (
        <View style={styles.emptyBanner}>
          <Ionicons name="map-outline" size={14} color={Palette.muted} />
          <Text style={styles.bannerText}>
            Noch keine Mahlzeiten mit Standort – beim nächsten Foto GPS erlauben
          </Text>
        </View>
      )}

      {/* Standort verweigert */}
      {locStatus === 'denied' && mealMarkers.length === 0 && (
        <View style={[styles.emptyBanner, { bottom: 64 }]}>
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

  // Marker-Pin
  pin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.white,
    borderWidth: 2.5,
    borderColor: Palette.green400,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  pinPhoto: {
    width: 44,
    height: 44,
  },

  // Callout
  callout: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    width: 220,
  },
  calloutPhoto: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  calloutInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  calloutName: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.green900,
  },
  calloutCal: {
    fontSize: 12,
    color: Palette.green500,
    fontWeight: '600',
  },
  calloutDate: {
    fontSize: 11,
    color: Palette.muted,
  },
  calloutHint: {
    fontSize: 10,
    color: Palette.green300,
    marginTop: 2,
  },

  // Leerer/Denied Banner
  emptyBanner: {
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
