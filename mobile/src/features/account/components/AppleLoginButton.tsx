import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { Button, FullScreenLoader, Text } from '@/components';
import { Apple as AppleIcon } from '@/icons';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { allStaticQueryKeys } from '@/lib/react-query';
import { allSecureStoreKeys, saveToSecureStore } from '@/lib/secure-store';
import { handleAxiosErrorAlertAndHaptics, isIOS } from '@/utils';

import { usePostAppleLogin, type SocialLoginPayload } from '../api';

const customStyles = StyleSheet.create({
  appleLogo: {
    position: 'absolute',
    left: 24,
  },
});

export const AppleLoginButton: React.FunctionComponent = () => {
  const { mutate: postAppleLogin, isLoading: isAppleLoginLoading } =
    usePostAppleLogin();

  const [_, setToken] = useMMKVString(allMMKVKeys.token);

  const queryClient = useQueryClient();

  const handlePress = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Get and save the user's name as these would not be recoverable on server
      const { familyName, givenName } = credentials.fullName ?? {};

      if (familyName && givenName) {
        await saveToSecureStore(allSecureStoreKeys.appleFamilyName, familyName);
        await saveToSecureStore(allSecureStoreKeys.appleGivenName, givenName);
      }

      const socialLoginPayload: SocialLoginPayload = {
        accessToken: undefined,
        code: credentials?.authorizationCode ?? undefined,
        idToken: credentials?.identityToken ?? undefined,
      };

      postAppleLogin(socialLoginPayload, {
        onSuccess: ({ key, user }) => {
          queryClient.setQueryData(allStaticQueryKeys.getUserDetails, user);
          setToken(key);
          setAxiosDefaultToken(key, apiClient);
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics('Sign-in Error', error as AxiosError);
        },
      });
    } catch (e) {}
  };

  return isIOS() ? (
    <>
      <FullScreenLoader
        isVisible={isAppleLoginLoading}
        message="Logging you in..."
      />

      <Button
        backgroundColor="white"
        disabled={isAppleLoginLoading}
        marginBottom="6"
        marginLeft="auto"
        marginRight="auto"
        maxWidth="88%"
        width="100%"
        areHapticsEnabled
        onPress={handlePress}
      >
        <AppleIcon style={customStyles.appleLogo} />

        <Text color="black" fontFamily="Halver-Semibold">
          {isAppleLoginLoading ? 'Loading' : 'Continue with Apple'}
        </Text>
      </Button>
    </>
  ) : null;
};
