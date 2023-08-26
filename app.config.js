require('dotenv').config();

module.exports = {
  name: 'Veor',
  slug: 'veor-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'veorapp',
  userInterfaceStyle: 'light',
  primaryColor: '#41B89C',
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#41B89C',
  },
  plugins: [
    ['expo-notifications', {}],
    '@react-native-firebase/app',
    '@react-native-firebase/perf',
    '@react-native-firebase/crashlytics',
    '@react-native-firebase/auth',
    'expo-apple-authentication',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '13.0',
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your friends.',
      },
    ],
  ],
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/351d1afb-8024-466f-b677-131349a7979c',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.veor.app',
    buildNumber: '21',
    googleServicesFile: './ios/Veor/GoogleService-Info.plist',
    usesAppleSignIn: true,
    infoPlist: {
      FacebookClientToken: '36a7d8e006cfa47b127a5691088ec488',
    },
    config: {
      googleSignIn: {
        reservedClientId:
          'com.googleusercontent.apps.337918662627-t9jmi00dsps9tukp4aj233lr75es8hi5',
      },
    },
  },
  android: {
    package: 'org.veor.app',
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#41B89C',
    },
    googleServicesFile: './android/app/google-services.json',
  },
  web: {
    favicon: './assets/images/favicon.png',
    config: {
      firebase: {
        apiKey: "AIzaSyDQ5psYrYAZbXV45nO8Q1QyUST80ccGGNc",
        authDomain: "veor-app-93e91.firebaseapp.com",
        projectId: "veor-app-93e91",
        storageBucket: "veor-app-93e91.appspot.com",
        messagingSenderId: "102038303607",
        appId: "1:102038303607:web:e31ef500bb10ba2f8fa772",
        measurementId: "G-7HG3SG5009"
      },
    },
  },
  facebookScheme: 'fb266730982659184',
  facebookAppId: '266730982659184',
  facebookDisplayName: 'Veor',
  extra: {
    eas: {
      projectId: '351d1afb-8024-466f-b677-131349a7979c',
    },
    apiURL: process.env.API_URL || 'https://veor.lab.bctc.io',
  },
  owner: 'veroapp',
  runtimeVersion: {
    policy: 'sdkVersion',
  },
};
