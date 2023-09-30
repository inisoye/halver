// dotenv use inspired by: https://stackoverflow.com/a/70014657
import 'dotenv/config';

const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = {
  expo: {
    name: IS_DEV ? 'Halver (Dev)' : 'Halver',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: IS_DEV ? 'com.halver.dev' : 'com.halver',
      splash: {
        image: './assets/splash-light.png',
        resizeMode: 'contain',
        backgroundColor: '#ededed',
        dark: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#161616',
        },
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#161616',
      },
      package: IS_DEV ? 'com.halver.dev' : 'com.halver',
      splash: {
        image: './assets/splash-light.png',
        resizeMode: 'contain',
        backgroundColor: '#ededed',
        dark: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#161616',
        },
      },
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'com.halver.mobile://',
    extra: {
      eas: {
        projectId: 'ba971ccb-f80a-490c-8db7-cfd2cd57c5b4',
      },
      apiURL: process.env.API_URL ?? 'http://127.0.0.1:8000',
      androidClientId: IS_DEV
        ? process.env.DEV_GOOGLE_OAUTH_ANDROID_CLIENT_ID
        : process.env.GOOGLE_OAUTH_ANDROID_CLIENT_ID,
      iosClientId: IS_DEV
        ? process.env.DEV_GOOGLE_OAUTH_IOS_CLIENT_ID
        : process.env.GOOGLE_OAUTH_IOS_CLIENT_ID,
      webClientId: process.env.GOOGLE_OAUTH_WEB_CLIENT_ID,
      sentryDSN: process.env.SENTRY_DSN,
      isDevelopment: process.env.APP_VARIANT === 'development',
      isPreview: process.env.APP_VARIANT === 'preview',
    },
    plugins: [
      ['sentry-expo'],
      [
        'expo-build-properties',
        {
          ios: { flipper: true },
        },
      ],
      [
        'expo-contacts',
        {
          contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#ffffff',
        },
      ],
    ],
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
          },
        },
      ],
    },
  },
};
