import { AxiosError } from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useAtom } from 'jotai';
import * as React from 'react';
import { Alert, Text } from 'react-native';

import { Button, buttonTextSizes, FullScreenLoader, Screen } from '@/components';
import {
  IntroMarquee,
  tokenAtom,
  usePostSocialLogin,
  type SocialLoginPayload,
} from '@/features/account';
import { Google as GoogleIcon } from '@/icons';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { cn, formatAxiosErrorMessage } from '@/utils';

WebBrowser.maybeCompleteAuthSession();

export const Login: React.FunctionComponent = () => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);
  const { mutate: postSocialLogin, isLoading: isSocialLoginLoading } = usePostSocialLogin();
  const [_, setToken] = useAtom(tokenAtom);

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
        const errorMessage = formatAxiosErrorMessage(error as AxiosError);

        if (errorMessage) {
          Alert.alert('Sign-in Error', errorMessage, [
            {
              text: 'OK',
              style: 'default',
            },
          ]);
        }
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
      {isSocialLoginLoading && <FullScreenLoader />}

      <Screen isHeaderShown={false}>
        <IntroMarquee />

        <Button
          className="mx-auto mb-8 max-w-[88%] bg-white"
          disabled={!request || isSocialLoginLoading}
          isTextContentOnly={false}
          isHapticsEnabled
          onPress={handleClick}
        >
          <GoogleIcon className="absolute left-6" />

          <Text className={cn(buttonTextSizes.default, 'mx-auto text-grey-dark-200')}>
            {isSocialLoginLoading ? 'Loading' : 'Continue with Google'}
          </Text>
        </Button>
      </Screen>
    </>
  );
};
