import { Ionicons } from '@expo/vector-icons';
import { CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

export default function NewEntryScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  // ── Noch laden ──
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Palette.green400} size="large" />
      </View>
    );
  }

  // ── Berechtigung verweigert ──
  if (!permission.granted) {
    return (
      <View style={[styles.centered, styles.root]}>
        <StatusBar style="dark" />
        <Ionicons name="camera-outline" size={64} color={Palette.green300} />
        <Text style={styles.permTitle}>Kamera-Zugriff nötig</Text>
        <Text style={styles.permSubtitle}>
          SnapMeal braucht Kamera-Zugriff, um Fotos deiner Mahlzeiten aufzunehmen.
        </Text>
        {permission.canAskAgain ? (
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission} activeOpacity={0.8}>
            <Text style={styles.permBtnText}>Zugriff erlauben</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.permBtn}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.8}>
            <Text style={styles.permBtnText}>Einstellungen öffnen</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const handleCapture = async () => {
    if (capturing || !cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, exif: false });
      if (photo?.uri) {
        router.push({ pathname: '/confirm-entry', params: { photoUri: photo.uri } });
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      router.push({ pathname: '/confirm-entry', params: { photoUri: result.assets[0].uri } });
    }
  };

  const cycleFlash = () => {
    setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'));
  };

  const flashIcon =
    flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off-outline';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} flash={flash} />

      {/* Top controls */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={cycleFlash} activeOpacity={0.75}>
          <Ionicons name={flashIcon} size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.flashLabel}>
          {flash !== 'off' && (
            <Text style={styles.flashLabelText}>{flash === 'auto' ? 'AUTO' : 'AN'}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/gallery')}
          activeOpacity={0.75}>
          <Ionicons name="grid-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Corner brackets */}
      <View style={styles.bracketTL} />
      <View style={styles.bracketTR} />
      <View style={styles.bracketBL} />
      <View style={styles.bracketBR} />

      {/* Bottom controls */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        {/* Galerie */}
        <TouchableOpacity style={styles.sideBtn} onPress={handleGallery} activeOpacity={0.75}>
          <Ionicons name="images-outline" size={26} color="#fff" />
          <Text style={styles.sideBtnLabel}>Galerie</Text>
        </TouchableOpacity>

        {/* Auslöser */}
        <TouchableOpacity
          style={styles.captureBtn}
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={capturing}>
          {capturing ? (
            <ActivityIndicator color={Palette.green900} size="small" />
          ) : (
            <View style={styles.captureInner} />
          )}
        </TouchableOpacity>

        {/* Kamera wechseln */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          activeOpacity={0.75}>
          <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
          <Text style={styles.sideBtnLabel}>Wechseln</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BRACKET = 28;
const BRACKET_W = 3;
const BRACKET_R = 20;
const BRACKET_OFFSET = '22%';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: Palette.green50,
  },

  // Permission screen
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.green900,
    textAlign: 'center',
  },
  permSubtitle: {
    fontSize: 14,
    color: Palette.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  permBtn: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 8,
  },
  permBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashLabel: {
    minWidth: 40,
    alignItems: 'center',
  },
  flashLabelText: {
    color: Palette.green400,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Brackets
  bracketTL: {
    position: 'absolute',
    top: BRACKET_OFFSET,
    left: '12%',
    width: BRACKET,
    height: BRACKET,
    borderTopWidth: BRACKET_W,
    borderLeftWidth: BRACKET_W,
    borderColor: Palette.green400,
    borderTopLeftRadius: BRACKET_R,
  },
  bracketTR: {
    position: 'absolute',
    top: BRACKET_OFFSET,
    right: '12%',
    width: BRACKET,
    height: BRACKET,
    borderTopWidth: BRACKET_W,
    borderRightWidth: BRACKET_W,
    borderColor: Palette.green400,
    borderTopRightRadius: BRACKET_R,
  },
  bracketBL: {
    position: 'absolute',
    bottom: BRACKET_OFFSET,
    left: '12%',
    width: BRACKET,
    height: BRACKET,
    borderBottomWidth: BRACKET_W,
    borderLeftWidth: BRACKET_W,
    borderColor: Palette.green400,
    borderBottomLeftRadius: BRACKET_R,
  },
  bracketBR: {
    position: 'absolute',
    bottom: BRACKET_OFFSET,
    right: '12%',
    width: BRACKET,
    height: BRACKET,
    borderBottomWidth: BRACKET_W,
    borderRightWidth: BRACKET_W,
    borderColor: Palette.green400,
    borderBottomRightRadius: BRACKET_R,
  },

  // Bottom controls
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: {
    width: 64,
    alignItems: 'center',
    gap: 4,
  },
  sideBtnLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});
