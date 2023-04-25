import * as React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { ReactQueryProvider } from '@/lib/react-query';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FunctionComponent<ProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ReactQueryProvider>
        <RootSiblingParent>{children}</RootSiblingParent>
      </ReactQueryProvider>
    </SafeAreaProvider>
  );
};
