// Web stub: react-native-maps imports native internals that can't run on web.
// metro.config.js redirects 'react-native-maps' here when platform === 'web'.
const noop = () => null;

const MapView: any = noop;
MapView.Animated = noop;
export default MapView;

export const Marker: any          = noop;
export const Callout: any         = noop;
export const CalloutSubview: any  = noop;
export const Circle: any          = noop;
export const Polygon: any         = noop;
export const Polyline: any        = noop;
export const Overlay: any         = noop;
export const UrlTile: any         = noop;
export const PROVIDER_GOOGLE      = 'google';
export const PROVIDER_DEFAULT     = null;

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};
