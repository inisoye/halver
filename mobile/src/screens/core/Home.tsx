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
  TouchableOpacity,
} from '@/components';
import { useUserDetails } from '@/features/account';
import { useInfiniteUserTransactions } from '@/features/financials';
import {
  ActionStatusCounts,
  RecentTransactions,
  useActionStatusCounts,
} from '@/features/home';
import { BillCreationMMKVPayload } from '@/features/new-bill';
import { AddBank, AddCard, AddPhoto, HalverMillipede } from '@/icons';
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

  const { data: userDetails } = useUserDetails();

  const {
    defaultCard,
    defaultTransferRecipient,
    profileImageHash,
    profileImageUrl,
  } = userDetails || {};

  const allTodos = [
    {
      name: 'Add your card',
      status: !!defaultCard,
      heading: 'Add your card',
      subtitle: 'Start making contributions',
      icon: <AddCard />,
      color: 'indigo',
    },
    {
      name: 'Add a recipient',
      status: !!defaultTransferRecipient,
      heading: 'Add your account',
      subtitle: 'Collect contributions',
      icon: <AddBank />,
      color: 'plum',
    },
    {
      name: 'Edit profile image',
      status: !!profileImageUrl && !!profileImageHash,
      heading: 'Add your photo',
      subtitle: 'Be easily recognisable',
      icon: <AddPhoto />,
      color: 'crimson',
    },
  ] as const;

  const pendingTodos = allTodos.filter(({ status }) => !status);

  const isOnlyOneTodo = pendingTodos.length === 1;

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
    <Screen hasNoIOSBottomInset>
      <ScrollView>
        <Box flex={1} paddingHorizontal="6" paddingVertical="2">
          <ActionStatusCounts navigation={navigation} />

          {pendingTodos.length > 0 && (
            <Box>
              <DynamicText
                fontFamily="Halver-Semibold"
                marginBottom="3"
                variant="xl"
              >
                Still to be done
              </DynamicText>

              <Box
                flexDirection="row"
                gap="3"
                justifyContent="space-between"
                marginBottom="10"
              >
                {pendingTodos.map(
                  ({ name, heading, subtitle, icon, color }) => {
                    const goToScreen = () => {
                      navigation.navigate(name);
                    };

                    return (
                      <TouchableOpacity
                        backgroundColor={`${color}3`}
                        borderRadius="lg"
                        elevation={1}
                        flexBasis="31%"
                        flexDirection={isOnlyOneTodo ? 'row' : undefined}
                        flexGrow={1}
                        justifyContent={
                          isOnlyOneTodo ? 'space-between' : undefined
                        }
                        key={name}
                        paddingVertical="3"
                        shadowColor="black"
                        shadowOffset={{
                          width: 0.1,
                          height: 0.1,
                        }}
                        shadowOpacity={0.2}
                        shadowRadius={0.3}
                        onPress={goToScreen}
                      >
                        <Box
                          borderBottomColor={`${color}4`}
                          borderBottomWidth={isOnlyOneTodo ? undefined : 1}
                          gap="2"
                          paddingBottom={isOnlyOneTodo ? undefined : '2.5'}
                          paddingHorizontal="3"
                        >
                          <Text
                            color={`${color}12`}
                            fontFamily="Halver-Semibold"
                          >
                            {heading}
                          </Text>
                          <Text
                            color={`${color}12`}
                            fontFamily="Halver-Semibold"
                            opacity={0.5}
                            variant="xxs"
                          >
                            {subtitle}
                          </Text>
                        </Box>

                        <Box paddingHorizontal="3" paddingTop="2">
                          {icon}
                        </Box>
                      </TouchableOpacity>
                    );
                  },
                )}
              </Box>
            </Box>
          )}

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
                hitSlop={100}
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
                  Get started
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
