import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddTransferRecipientForm } from '@/features/financials';
import type { AppRootStackParamList, FinancialsStackParamList } from '@/navigation';

type AddTransferRecipientProps = CompositeScreenProps<
  NativeStackScreenProps<FinancialsStackParamList, 'Add a recipient'>,
  NativeStackScreenProps<AppRootStackParamList, 'Add a recipient'>
>;

export const AddTransferRecipient: React.FunctionComponent<
  AddTransferRecipientProps
> = ({ navigation }) => {
  const onAddTransferRecipientComplete = React.useCallback(() => {
    navigation.navigate('Transfer recipients');
  }, [navigation]);

  return <AddTransferRecipientForm onComplete={onAddTransferRecipientComplete} />;
};
