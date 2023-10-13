import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddTransferRecipientForm } from '@/features/financials';
import type { OnboardingStackParamList } from '@/navigation';

type BankAcountDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'BankAccountDetails'
>;

export const BankAccountDetails: React.FunctionComponent<
  BankAcountDetailsProps
> = ({ navigation }) => {
  const onAddTransferRecipientComplete = React.useCallback(() => {
    navigation.navigate('CardDetails');
  }, [navigation]);

  return (
    <AddTransferRecipientForm
      isOnboarding
      onComplete={onAddTransferRecipientComplete}
    />
  );
};
