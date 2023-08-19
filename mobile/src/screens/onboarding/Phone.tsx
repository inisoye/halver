import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { EditPhoneNumberForm } from '@/features/account';
import type { OnboardingStackParamList } from '@/navigation';

type PhoneProps = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

export const Phone: React.FunctionComponent<PhoneProps> = ({ navigation }) => {
  const handleGoToBankAccountDetails = () => {
    navigation.navigate('BankAccountDetails');
  };

  return <EditPhoneNumberForm isOnboarding onComplete={handleGoToBankAccountDetails} />;
};
