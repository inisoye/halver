import type { AxiosError } from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { Button, FullScreenLoader, Text } from '@/components';
import { Google as GoogleIcon } from '@/icons';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { handleAxiosErrorAlertAndHaptics, isIOS } from '@/utils';

import { usePostGoogleLogin, type SocialLoginPayload } from '../api';

WebBrowser.maybeCompleteAuthSession();

const customStyles = StyleSheet.create({
  googleLogo: {
    position: 'absolute',
    left: 24,
  },
});

export const GoogleLoginButton: React.FunctionComponent = () => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(
    undefined,
  );
  const { mutate: postGoogleLogin, isLoading: isGoogleLoginLoading } =
    usePostGoogleLogin();
  const [_, setToken] = useMMKVString(allMMKVKeys.token);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants.expoConfig?.extra?.androidClientId,
    iosClientId: Constants.expoConfig?.extra?.iosClientId,
    webClientId: Constants.expoConfig?.extra?.webClientId,
  });

  const socialLoginPayload: SocialLoginPayload = {
    accessToken,
    code: undefined,
    idToken: undefined,
  };

  const handleGoogleLogin = async () => {
    postGoogleLogin(socialLoginPayload, {
      onSuccess: ({ key }) => {
        setToken(key);
        setAxiosDefaultToken(key, apiClient);
      },

      onError: error => {
        handleAxiosErrorAlertAndHaptics('Sign-in Error', error as AxiosError);
      },
    });
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication?.accessToken);
      if (accessToken) handleGoogleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, accessToken]);

  const handleClick = () => {
    promptAsync();
  };

  return (
    <>
      <FullScreenLoader
        isVisible={isGoogleLoginLoading}
        message="Logging you in..."
      />

      <Button
        backgroundColor={isIOS() ? 'loginButtonDark' : 'white'}
        disabled={!request || isGoogleLoginLoading}
        marginBottom={isIOS() ? '16' : '8'}
        marginLeft="auto"
        marginRight="auto"
        maxWidth="88%"
        width="100%"
        areHapticsEnabled
        onPress={handleClick}
      >
        <GoogleIcon style={customStyles.googleLogo} />

        <Text color={isIOS() ? 'white' : 'black'} fontFamily="Halver-Semibold">
          {isGoogleLoginLoading ? 'Loading' : 'Continue with Google'}
        </Text>
      </Button>
    </>
  );
};
