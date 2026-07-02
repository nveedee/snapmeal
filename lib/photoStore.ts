// Zwischenspeicher für Base64-Bilddaten zwischen Kamera-Screen und Bestätigungsformular.
// Nicht in Router-Params, da Base64 zu gross für URL-Encoding ist.
let _base64: string | null = null;

export const photoStore = {
  set:   (v: string) => { _base64 = v; },
  get:   ()          => _base64,
  clear: ()          => { _base64 = null; },
};
