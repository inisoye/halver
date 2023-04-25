import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const ReactQueryProvider: React.FunctionComponent<ReactQueryProviderProps> = ({
  children,
}) => {
  onlineManager.setEventListener(setOnline => {
    return NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected);
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
