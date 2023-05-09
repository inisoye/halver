import { AxiosError } from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Text } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { Button, buttonTextSizes, FullScreenLoader, Screen } from '@/components';
import { IntroMarquee, usePostSocialLogin, type SocialLoginPayload } from '@/features/account';
import { Google as GoogleIcon } from '@/icons';
import { apiClient, setAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { cn, handleErrorAlertAndHaptics } from '@/utils';

WebBrowser.maybeCompleteAuthSession();

export const Login: React.FunctionComponent = () => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(undefined);
  const { mutate: postSocialLogin, isLoading: isSocialLoginLoading } = usePostSocialLogin();
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
        handleErrorAlertAndHaptics('Sign-in Error', error as AxiosError);
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

      <Screen className="md:flex-row md:items-center" isHeaderShown={false}>
        <IntroMarquee />

        <Button
          className="mx-auto mb-8 w-full max-w-[88%] bg-white md:max-w-full"
          disabled={!request || isSocialLoginLoading}
          isTextContentOnly={false}
          pressableClassName="md:flex-1 md:h-max md:max-w-sm md:mx-auto md:px-4"
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
