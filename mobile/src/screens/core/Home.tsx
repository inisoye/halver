import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import {
  Box,
  Button,
  Card,
  DynamicText,
  Screen,
  ScrollView,
  Text,
} from '@/components';
import { useInfiniteUserTransactions } from '@/features/financials';
import {
  ActionStatusCounts,
  HomeAvatar,
  RecentTransactions,
  Todos,
  useActionStatusCounts,
} from '@/features/home';
import { BillCreationMMKVPayload } from '@/features/new-bill';
import { HalverMillipede } from '@/icons';
import { isAPIClientTokenSet } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import type {
  AppRootStackParamList,
  HomeStackParamList,
  TabParamList,
} from '@/navigation';

type HomeProps = CompositeScreenProps<
  NativeStackScreenProps<AppRootStackParamList, 'Home'>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'HomeStackNavigator'>,
    NativeStackScreenProps<HomeStackParamList, 'Home'>
  >
>;

export const Home = ({ navigation }: HomeProps) => {
  const [_newBillPayload, setNewBillPayload] =
    useMMKVObject<BillCreationMMKVPayload>(allMMKVKeys.newBillPayload);

  // Clear old form data to prevent inconsistencies and unforseen issues.
  React.useEffect(() => {
    return () => {
      setNewBillPayload(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToAllTransactions = React.useCallback(() => {
    navigation.navigate('Transactions');
  }, [navigation]);

  const {
    refetch: refetchActionStatusCounts,
    isStale: areActionStatusCountsStale,
  } = useActionStatusCounts();
  const { refetch: refetchTransactions, isStale: areTransactionsStale } =
    useInfiniteUserTransactions();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAPIClientTokenSet()) {
        if (areActionStatusCountsStale) refetchActionStatusCounts();
        if (areTransactionsStale) refetchTransactions();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areActionStatusCountsStale, areTransactionsStale]);

  return (
    <Screen headerRightComponent={<HomeAvatar />} hasNoIOSBottomInset>
      <ScrollView>
        <Box flex={1} paddingBottom="6" paddingHorizontal="6" paddingTop="2">
          <ActionStatusCounts navigation={navigation} />

          <Todos navigation={navigation} />

          <Card marginBottom="10">
            <Box
              alignItems="flex-start"
              overflow="hidden"
              paddingHorizontal="4"
              paddingVertical="5"
            >
              <Text fontFamily="Halver-Semibold" marginBottom="4" variant="xl">
                Create a bill
              </Text>

              <DynamicText
                color="textLight"
                marginBottom="6"
                maxWidth={190}
                variant="sm"
              >
                You can invite a maximum of sixteen people to it.
              </DynamicText>

              <HalverMillipede />

              <Button
                backgroundColor="buttonCasal"
                hitSlop={5}
                marginTop="16"
                variant="sm"
                onPress={() => {
                  navigation.navigate('Bill Details');
                }}
              >
                <Text
                  color="buttonTextCasal"
                  fontFamily="Halver-Semibold"
                  variant="sm"
                >
                  Proceed
                </Text>
              </Button>
            </Box>
          </Card>

          <RecentTransactions
            goToAllTransactions={goToAllTransactions}
            navigation={navigation}
          />
        </Box>
      </ScrollView>
    </Screen>
  );
};
