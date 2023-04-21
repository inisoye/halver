import * as React from 'react';
import { Text } from 'react-native';

import { Button, buttonTextSizes, IntroMarquee, Screen } from '@/components';
import { Google as GoogleIcon } from '@/icons';
import { cn } from '@/utils';

export const Login: React.FunctionComponent = () => {
  return (
    <Screen isHeaderShown={false}>
      <IntroMarquee />

      <Button className="mx-auto mb-12 max-w-[88%] bg-white" isTextContentOnly={false}>
        <GoogleIcon className="absolute left-6" />

        <Text className={cn(buttonTextSizes.default, 'mx-auto text-grey-dark-200')}>
          Continue with Google
        </Text>
      </Button>
    </Screen>
  );
};
