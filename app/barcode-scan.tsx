/*
 * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
 * Zweck: Barcode-Scanner-Screen – scannt EAN/UPC-Barcodes via CameraView und
 *        übergibt den Code an den Bestätigungs-Screen. Keine API-Logik hier.
 */

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
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

export default function BarcodeScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const insets = useSafeAreaInsets();

  // Laden
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Palette.green400} size="large" />
      </View>
    );
  }

  // Berechtigung verweigert
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <StatusBar style="dark" />
        <Ionicons name="barcode-outline" size={64} color={Palette.green300} />
        <Text style={styles.permTitle}>Kamera-Zugriff nötig</Text>
        <Text style={styles.permSubtitle}>
          Zum Scannen von Barcodes wird die Kamera benötigt.
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Abbrechen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
   * Zweck: onBarcodeScanned-Handler – gibt gescannten Barcode via router.push
   *        an den Bestätigungs-Screen weiter. Verarbeitung (API-Call, Formular-
   *        befüllung) findet dort statt – TODO Elias (Phase 2.2 / OpenFoodFacts).
   */
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    router.replace({
      pathname: '/confirm-entry',
      params: { barcode: data },
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/*
       * KI-generiert (Claude Sonnet 4.6, 02.07.2026)
       * Zweck: CameraView mit Barcode-Scanner.
       *   barcodeScannerSettings.barcodeTypes: EAN-13 (Lebensmittel EU),
       *   EAN-8 (kleine Verpackungen), UPC-A (USA) – reicht für Open Food Facts.
       * Quelle Expo Camera Docs: https://docs.expo.dev/versions/v54.0.0/sdk/camera/
       */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a'],
        }}
      />

      {/* Zurück-Button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.75}>
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Scan-Rahmen */}
      <View style={styles.frame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Hinweistext */}
      <View style={[styles.hintBox, { bottom: insets.bottom + 48 }]}>
        <Text style={styles.hintText}>
          {scanned ? 'Barcode erkannt …' : 'Barcode in den Rahmen halten'}
        </Text>
      </View>
    </View>
  );
}

const CORNER = 28;
const CORNER_W = 3;
const CORNER_R = 8;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: Palette.green50,
  },

  permTitle:    { fontSize: 20, fontWeight: '700', color: Palette.green900, textAlign: 'center' },
  permSubtitle: { fontSize: 14, color: Palette.muted, textAlign: 'center', lineHeight: 21 },
  permBtn: {
    backgroundColor: Palette.green400,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 8,
  },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  backLink:     { marginTop: 8 },
  backLinkText: { color: Palette.muted, fontSize: 14 },

  backBtn: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scan-Rahmen (visuelles Hilfselement)
  frame: {
    position: 'absolute',
    alignSelf: 'center',
    top: '28%',
    width: '70%',
    aspectRatio: 1.6,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#fff',
  },
  cornerTL: { top: 0,    left: 0,    borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W,  borderTopLeftRadius: CORNER_R },
  cornerTR: { top: 0,    right: 0,   borderTopWidth: CORNER_W, borderRightWidth: CORNER_W, borderTopRightRadius: CORNER_R },
  cornerBL: { bottom: 0, left: 0,    borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W,  borderBottomLeftRadius: CORNER_R },
  cornerBR: { bottom: 0, right: 0,   borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W, borderBottomRightRadius: CORNER_R },

  hintBox: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  hintText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
