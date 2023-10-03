import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components';
import { GoogleLoginButton, IntroMarquee } from '@/features/account';

export const customStyles = StyleSheet.create({
  googleLogo: {
    position: 'absolute',
    left: 24,
  },
});

export const Login: React.FunctionComponent = () => {
  return (
    <>
      <Screen isHeaderShown={false}>
        <IntroMarquee />

        <GoogleLoginButton />
      </Screen>
    </>
  );
};
