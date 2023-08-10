import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { FadeInDown, StretchInY } from 'react-native-reanimated';

import { AnimatedTouchableOpacity, Box, Screen, Text } from '@/components';
import {
  Bank as BankIcon,
  Card as CardIcon,
  Coin as CoinIcon,
  RightArrow,
} from '@/icons';
import { FinancialsStackParamList } from '@/navigation';

type FinancialsProps = NativeStackScreenProps<FinancialsStackParamList, 'Financials'>;

export const Financials: React.FunctionComponent<FinancialsProps> = ({
  navigation,
}) => {
  const goToCards = () => {
    navigation.navigate('Cards');
  };
  const goToTransferRecipients = () => {
    navigation.navigate('Transfer recipients');
  };
  const goToTransactions = () => {
    navigation.navigate('Transactions');
  };

  return (
    <Screen>
      <Box flex={1} gap="4" paddingHorizontal="6" paddingVertical="2">
        <AnimatedTouchableOpacity
          backgroundColor="buttonNeutral"
          borderRadius="lg"
          elevation={1}
          entering={StretchInY.springify()}
          gap="16"
          padding="4"
          shadowColor="black"
          shadowOffset={{
            width: 0.1,
            height: 0.3,
          }}
          shadowOpacity={0.2}
          shadowRadius={0.3}
          onPress={goToCards}
        >
          <CardIcon />

          <Box
            alignItems="center"
            flexDirection="row"
            gap="4"
            justifyContent="space-between"
          >
            <Text color="buttonTextNeutral" fontFamily="Halver-Semibold" variant="2xl">
              Cards
            </Text>

            <RightArrow />
          </Box>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          alignItems="center"
          backgroundColor="buttonNeutral"
          borderRadius="lg"
          elevation={1}
          entering={FadeInDown.springify().delay(400)}
          flexDirection="row"
          gap="4"
          justifyContent="space-between"
          paddingHorizontal="4"
          paddingVertical="2.5"
          shadowColor="black"
          shadowOffset={{
            width: 0.1,
            height: 0.3,
          }}
          shadowOpacity={0.2}
          shadowRadius={0.3}
          onPress={goToTransferRecipients}
        >
          <Box alignItems="center" flexDirection="row" gap="3">
            <BankIcon />

            <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
              Transfer recipients
            </Text>
          </Box>

          <RightArrow />
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          alignItems="center"
          backgroundColor="buttonNeutral"
          borderRadius="lg"
          elevation={1}
          entering={FadeInDown.springify().delay(750)}
          flexDirection="row"
          gap="4"
          justifyContent="space-between"
          paddingHorizontal="4"
          paddingVertical="2.5"
          shadowColor="black"
          shadowOffset={{
            width: 0.1,
            height: 0.3,
          }}
          shadowOpacity={0.2}
          shadowRadius={0.3}
          onPress={goToTransactions}
        >
          <Box alignItems="center" flexDirection="row" gap="3">
            <CoinIcon />

            <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
              Transactions
            </Text>
          </Box>

          <RightArrow />
        </AnimatedTouchableOpacity>
      </Box>
    </Screen>
  );
};
