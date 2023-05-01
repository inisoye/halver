import NetInfo from '@react-native-community/netinfo';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { focusManager, onlineManager, Query, QueryClient, QueryKey } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as React from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { GET_USER_DETAILS_QUERY_KEY } from '@/features/account';

import { storage } from './mmkv';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const clientStorage = {
  setItem: (key: string, value): void => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({ storage: clientStorage });

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

const persistedQueriesList: QueryKey[] = [GET_USER_DETAILS_QUERY_KEY];

export const ReactQueryProvider: React.FunctionComponent<ReactQueryProviderProps> = ({
  children,
}) => {
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: clientPersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query: Query) => {
            return (
              query.state.status === 'success' && persistedQueriesList.includes(query.queryKey)
            );
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
