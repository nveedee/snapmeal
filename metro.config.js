const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

// react-native-maps imports RN native internals that crash the web bundler.
// Redirect the whole package to a no-op stub when building for web.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'lib/maps-stub.ts'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
