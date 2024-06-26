// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  server: {
    rewriteRequestUrl: (url) => {
      if (!url.endsWith('.bundle')) {
        return url;
      }
      // https://github.com/facebook/react-native/issues/36794
      // JavaScriptCore strips query strings, so try to re-add them with a best guess.
      return (
        url +
        '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true'
      );
    },
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'] //add here
  },
};
