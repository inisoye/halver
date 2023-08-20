import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, Card, DynamicText, Screen, ScrollView, Text } from '@/components';
import { ActionStatusCounts, RecentTransactions } from '@/features/home';
import { HalverMillipede } from '@/icons';
import type { AppRootStackParamList, TabParamList } from '@/navigation';

type HomeProps = CompositeScreenProps<
  NativeStackScreenProps<AppRootStackParamList, 'Home'>,
  BottomTabScreenProps<TabParamList, 'HomeStackNavigator'>
>;

export const Home = ({ navigation }: HomeProps) => {
  const goToAllTransactions = React.useCallback(() => {
    navigation.navigate('FinancialsStackNavigator', { screen: 'Transactions' });
  }, [navigation]);

  return (
    <Screen hasNoIOSBottomInset>
      <ScrollView>
        <Box flex={1} paddingHorizontal="6" paddingVertical="2">
          <ActionStatusCounts navigation={navigation} />

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
                <Text color="buttonTextCasal" fontFamily="Halver-Semibold" variant="sm">
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
