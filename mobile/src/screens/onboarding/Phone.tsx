import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { EditPhoneNumberForm } from '@/features/account';
import { prefetchBanks } from '@/features/financials';
import type { OnboardingStackParamList } from '@/navigation';

type PhoneProps = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

export const Phone: React.FunctionComponent<PhoneProps> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const handleGoToBankAccountDetails = () => {
    prefetchBanks(queryClient);
    navigation.navigate('BankAccountDetails');
  };

  return (
    <EditPhoneNumberForm
      isOnboarding
      onComplete={handleGoToBankAccountDetails}
    />
  );
};
