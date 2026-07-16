const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Sentry wraps Expo's default Metro config to enable source map upload
// and debug ID injection. It is a superset of `expo/metro-config`.
const config = getSentryExpoConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

module.exports = config;
