import { AxiosError } from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { Button, FullScreenLoader, Screen, Text } from '@/components';
import {
  IntroMarquee,
  usePostSocialLogin,
  type SocialLoginPayload,
} from '@/features/account';
import { Google as GoogleIcon } from '@/icons';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { handleAxiosErrorAlertAndHaptics } from '@/utils';

WebBrowser.maybeCompleteAuthSession();

export const customStyles = StyleSheet.create({
  googleLogo: {
    position: 'absolute',
    left: 24,
  },
});

export const Login: React.FunctionComponent = () => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);
  const { mutate: postSocialLogin, isLoading: isSocialLoginLoading } =
    usePostSocialLogin();
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

  const handleLogin = async () => {
    postSocialLogin(socialLoginPayload, {
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
      if (accessToken) handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, accessToken]);

  const handleClick = () => {
    promptAsync();
  };

  return (
    <>
      <FullScreenLoader isVisible={isSocialLoginLoading} message="Logging you in..." />

      <Screen isHeaderShown={false}>
        <IntroMarquee />

        <Button
          backgroundColor="white"
          disabled={!request || isSocialLoginLoading}
          marginBottom="16"
          marginLeft="auto"
          marginRight="auto"
          maxWidth="88%"
          width="100%"
          areHapticsEnabled
          onPress={handleClick}
        >
          <GoogleIcon style={customStyles.googleLogo} />

          <Text color="textBlack" fontFamily="Halver-Semibold">
            {isSocialLoginLoading ? 'Loading' : 'Continue with Google'}
          </Text>
        </Button>
      </Screen>
    </>
  );
};
