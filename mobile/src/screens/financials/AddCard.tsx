import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddCardForm } from '@/features/financials';
import type {
  AppRootStackParamList,
  FinancialsStackParamList,
} from '@/navigation';

type AddCardProps = CompositeScreenProps<
  NativeStackScreenProps<FinancialsStackParamList, 'Add your card'>,
  NativeStackScreenProps<AppRootStackParamList, 'Add your card'>
>;

export const AddCard: React.FunctionComponent<AddCardProps> = ({
  navigation,
}) => {
  const onAddCardComplete = React.useCallback(() => {
    navigation.navigate('Cards');
  }, [navigation]);

  return <AddCardForm onComplete={onAddCardComplete} />;
};
