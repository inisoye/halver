import * as React from 'react';

import { IntroMarquee, Screen } from '@/components';

export const Login: React.FunctionComponent = () => {
  return (
    <Screen isHeaderShown={false}>
      <IntroMarquee />
    </Screen>
  );
};
