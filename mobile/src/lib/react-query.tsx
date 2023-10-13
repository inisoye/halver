import NetInfo from '@react-native-community/netinfo';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import {
  focusManager,
  onlineManager,
  QueryClient,
  type Query,
  type QueryKey,
} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as React from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { storage } from './mmkv';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * MMKV for React Query setup.
 * https://github.com/mrousavy/react-native-mmkv/blob/9be3bb5d8fad1065c20715d9044d6c809ef72981/docs/WRAPPER_REACT_QUERY.md
 */
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

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
});

/**
 * Online status management. Refetches when user is back online.
 * https://tanstack.com/query/latest/docs/react/react-native#online-status-management
 * @param status
 */
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/**
 * Refetch on app focus.
 * https://tanstack.com/query/latest/docs/react/react-native#refetch-on-app-focus
 */
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

/**
 * Centralize all query keys here.
 */
export const allStaticQueryKeys = {
  getActionStatusCounts: ['action-status-counts'],
  getBanks: ['banks'],
  getBill: ['bill'],
  getBillContributionsByDay: ['bill-contributions-by-day'],
  getBills: ['bills'],
  getBillTransactions: ['bill-transactions'],
  getBillTransactionsOnDay: ['bill-transactions-on-day'],
  getCardAdditionURL: ['card-addition-url'],
  getCards: ['cards'],
  getIsFirstTime: ['is-first-time'],
  getPhoneContacts: ['phone-contacts'],
  getRegisteredContacts: ['registered-contacts'],
  getTransferRecipients: ['transfer-recipients'],
  getUserActions: ['user-actions'],
  getUserDetails: ['user-details'],
  getUserTransactions: ['user-transactions'],
};

/**
 * Specify the queries that should be stored in MMKV, by their keys.
 */
const persistedQueriesList: QueryKey[] = [
  allStaticQueryKeys.getBanks,
  allStaticQueryKeys.getCards,
  allStaticQueryKeys.getRegisteredContacts,
  allStaticQueryKeys.getTransferRecipients,
  allStaticQueryKeys.getUserDetails,
];

export const ReactQueryProvider: React.FunctionComponent<
  ReactQueryProviderProps
> = ({ children }) => {
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
              query.state.status === 'success' &&
              persistedQueriesList.includes(query.queryKey)
            );
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
