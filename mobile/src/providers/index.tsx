import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ModalfyProvider } from '@/lib/modalfy';
import { ReactQueryProvider } from '@/lib/react-query';
import { RestyleProvider } from '@/lib/restyle';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FunctionComponent<ProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <RestyleProvider>
        <ReactQueryProvider>
          <RootSiblingParent>
            <ModalfyProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                {children}
              </GestureHandlerRootView>
            </ModalfyProvider>
          </RootSiblingParent>
        </ReactQueryProvider>
      </RestyleProvider>
    </SafeAreaProvider>
  );
};
