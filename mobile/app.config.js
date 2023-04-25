// dotenv use inspired by: https://stackoverflow.com/a/70014657
import 'dotenv/config';

module.exports = {
  expo: {
    name: 'Halver',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.halver.mobile',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.halver.mobile',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'com.halver.mobile://',
    extra: {
      eas: {
        projectId: 'ba971ccb-f80a-490c-8db7-cfd2cd57c5b4',
      },
      apiUrl: process.env.API_URL ?? 'http://127.0.0.1:8000',
      androidClientId: process.env.GOOGLE_OAUTH_ANDROID_CLIENT_ID,
      iosClientId: process.env.GOOGLE_OAUTH_IOS_CLIENT_ID,
      webClientId: process.env.GOOGLE_OAUTH_WEB_CLIENT_ID,
    },
    plugins: [
      ['expo-build-properties', { ios: { flipper: true } }],
      ['expo-contacts', { contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.' }],
      ['expo-image-picker', { photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.' }],
    ],
  },
};
