import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { EditPhoneNumberForm } from '@/features/account';
import { AccountStackParamList } from '@/navigation';

type EditPhoneNumberProps = NativeStackScreenProps<
  AccountStackParamList,
  'Edit phone number'
>;

export const EditPhoneNumber: React.FunctionComponent<EditPhoneNumberProps> = ({
  navigation,
}) => {
  const handleGoToAccount = () => {
    navigation.navigate('Account');
  };

  return <EditPhoneNumberForm onComplete={handleGoToAccount} />;
};
